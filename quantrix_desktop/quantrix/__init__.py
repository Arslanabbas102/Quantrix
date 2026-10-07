"""Quantrix — financial AI agent platform with code-enforced analysis pipelines."""

from __future__ import annotations

from importlib.metadata import PackageNotFoundError, version
from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from quantrix.engine.pipelines.base import PipelineResult
    from quantrix.sdk import Quantrix

__all__ = ["Quantrix", "PipelineResult"]

# Single source of truth is pyproject.toml; read it back from the installed
# distribution so the version can never drift from what was published. The
# fallback covers running straight from a source tree that was never installed.
try:
    __version__ = version("quantrix")
except PackageNotFoundError:  # pragma: no cover - source checkout without install
    __version__ = "0.0.0.dev0"


def __getattr__(name: str) -> object:
    # Lazy re-exports (PEP 562). Importing `quantrix` — which happens on *any*
    # `import quantrix.<submodule>`, since Python runs this package __init__ —
    # must NOT eagerly drag in the heavy engine: `PipelineResult` pulls
    # pydantic_ai (~0.45s) via pipelines, `Quantrix` pulls edgartools (~0.46s)
    # via sdk→deps→data.layer. Those ~0.9s gated /health and the artifacts
    # SQLite routes behind the full analytical stack on every sidecar cold
    # start. Resolve these names only when actually accessed.
    if name == "Quantrix":
        from quantrix.sdk import Quantrix

        return Quantrix
    if name == "PipelineResult":
        from quantrix.engine.pipelines.base import PipelineResult

        return PipelineResult
    raise AttributeError(f"module {__name__!r} has no attribute {name!r}")
