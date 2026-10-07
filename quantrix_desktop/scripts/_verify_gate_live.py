"""Live end-to-end check: real equity_research pipeline, per-ticker gate + verdict."""

from __future__ import annotations

import asyncio
import sys
from pathlib import Path

from quantrix.config import get_settings
from quantrix.engine.agents.factory import create_sub_agents
from quantrix.engine.data.factory import build_data_layer
from quantrix.engine.deps import QuantrixDeps
from quantrix.engine.models.financial import ThesisResult, ValuationSynthesis
from quantrix.engine.pipelines.registry import get_pipeline_factories
from quantrix.engine.skills.registry import SkillRegistry
from quantrix.paths import SETTINGS_JSON
from quantrix.routes.settings import load_non_secret_settings
from quantrix.secret_store import create_secret_store
from quantrix.server import hydrate_settings_from_secrets

TICKERS = sys.argv[1:] or ["MSFT", "AVGO", "NVDA", "TSLA", "KO"]


async def build_deps() -> QuantrixDeps:
    settings = get_settings(**load_non_secret_settings(SETTINGS_JSON))
    store, _ = create_secret_store()
    settings = await hydrate_settings_from_secrets(settings, store)
    settings.validate_runtime_config()
    skills_path = Path(settings.skills_dir)
    registry = SkillRegistry(skills_path) if skills_path.exists() else None
    return QuantrixDeps(
        data_layer=build_data_layer(settings), settings=settings, skill_runtime=registry
    )


def _find(structured: dict[str, object], cls: type) -> object | None:
    for v in structured.values():
        if isinstance(v, cls):
            return v
    return None


async def main() -> None:
    deps = await build_deps()
    try:
        factories = get_pipeline_factories()
        rows = []
        for ticker in TICKERS:
            sub_agents = create_sub_agents(deps.settings, skill_registry=deps.skill_runtime)
            pipeline = factories["research"](sub_agents)
            try:
                result = await pipeline.execute(deps, ticker, lang="zh")
            except Exception as e:  # noqa: BLE001
                rows.append((ticker, f"pipeline error: {type(e).__name__}: {e}"))
                continue
            vs = _find(result.structured_data, ValuationSynthesis)
            thesis = _find(result.structured_data, ThesisResult)
            mids = {}
            ratio = "-"
            price = "-"
            if isinstance(vs, ValuationSynthesis):
                mids = {m.name: m.mid for m in vs.methods}
                price = f"${vs.current_price:.0f}"
                vals = [m.mid for m in vs.methods]
                if len(vals) >= 2 and min(vals) > 0:
                    ratio = f"{max(vals) / min(vals):.2f}x"
            verdict = thesis.recommendation if isinstance(thesis, ThesisResult) else "?"
            tgt = (
                f"${thesis.price_target:.2f}"
                if isinstance(thesis, ThesisResult) and thesis.price_target is not None
                else "WITHHELD"
            )
            midstr = "  ".join(f"{k}=${v:.0f}" for k, v in mids.items())
            rows.append(
                (ticker, f"mkt {price:>6} | {midstr} | spread {ratio:>6} | {verdict:7} {tgt}")
            )

        print("\n" + "=" * 78)
        for t, line in rows:
            print(f"  {t:6s} {line}")
        print("=" * 78)
    finally:
        # Non-server entrypoint: join the aiosqlite workers + checkpoint WAL so the
        # process exits cleanly instead of hanging on "Event loop is closed" (2026-06-24).
        from quantrix.engine.data.factory import shutdown_data_layer

        await shutdown_data_layer(deps.data_layer)


if __name__ == "__main__":
    asyncio.run(main())
