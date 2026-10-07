#!/usr/bin/env python3
"""Live-verify: RIVN /financials no longer 500s on negative gross margin.

Replicates routes/data.py::get_financials end-to-end against the REAL FMP
payload, using the in-process (new) code — no server restart needed. The dev
server runs without --reload, so this is how we confirm the model fix on live
data before the user re-runs ./dev.sh.
"""

from __future__ import annotations

import asyncio

from alpha_desk.config import get_settings
from alpha_desk.engine.compute.coordinators.extractor import extract_financial_data
from alpha_desk.engine.data.factory import build_data_layer
from alpha_desk.engine.data.types import DataType
from alpha_desk.paths import SETTINGS_JSON, ensure_home
from alpha_desk.routes.settings import load_non_secret_settings
from alpha_desk.secret_store import create_secret_store
from alpha_desk.server import hydrate_settings_from_secrets


async def main() -> None:
    ensure_home()
    settings = get_settings(**load_non_secret_settings(SETTINGS_JSON))
    secret_store, _ = create_secret_store()
    settings = await hydrate_settings_from_secrets(settings, secret_store)
    data_layer = build_data_layer(settings)

    for ticker in ("RIVN", "AFRM", "SNAP"):  # loss-makers / negative-margin candidates
        fin = await data_layer.fetch_canonical(DataType.FINANCIALS, ticker)
        price = await data_layer.fetch_canonical(DataType.PRICE, ticker)
        extracted = extract_financial_data(fin, price)
        gm = extracted.income.gross_margin
        om = extracted.income.operating_margin
        print(f"{ticker}: gross_margin={gm} operating_margin={om}  -> extract OK")


if __name__ == "__main__":
    asyncio.run(main())
