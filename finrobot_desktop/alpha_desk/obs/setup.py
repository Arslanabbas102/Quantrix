"""Single logging-configuration entry point for CLI and server."""

from __future__ import annotations

import logging
import sys
from logging.handlers import TimedRotatingFileHandler
from pathlib import Path
from typing import TYPE_CHECKING

from alpha_desk.obs.filters import RedactSecretsFilter, TraceFilter
from alpha_desk.obs.formatters import HumanFormatter, JsonFormatter

if TYPE_CHECKING:
    from alpha_desk.config import AlphaDeskSettings

_NOISY = ("httpx", "httpcore", "urllib3", "yfinance", "filelock")
_CONFIGURED = False


def setup_logging(
    settings: "AlphaDeskSettings",
    *,
    logs_dir: Path | None = None,
    force: bool = False,
) -> None:
    """Configure root logging. Idempotent unless ``force=True``.

    Console handler (human, colorized when stderr is a tty) is always added.
    A daily-rotating JSON file handler is added when ``settings.log_to_file``
    and the directory is writable; failure to open the file degrades to
    console-only rather than crashing startup.
    """
    global _CONFIGURED
    if _CONFIGURED and not force:
        return

    if logs_dir is None:
        from alpha_desk.paths import LOGS_DIR

        logs_dir = LOGS_DIR

    root = logging.getLogger()
    for h in list(root.handlers):
        root.removeHandler(h)
    root.setLevel(settings.log_level.upper())

    trace = TraceFilter()
    # Handler-level (not logger-level) so it also scrubs records propagated up
    # from uvicorn.access — whose full request line carries the ?token= secret.
    redact = RedactSecretsFilter()

    from alpha_desk.config import console_color_enabled

    console = logging.StreamHandler(stream=sys.stderr)
    console.setFormatter(HumanFormatter(color=console_color_enabled(sys.stderr)))
    console.addFilter(trace)
    console.addFilter(redact)
    root.addHandler(console)

    if settings.log_to_file:
        try:
            logs_dir.mkdir(parents=True, exist_ok=True)
            file_handler = TimedRotatingFileHandler(
                logs_dir / "alpha_desk.log",
                when="midnight",
                backupCount=settings.log_retention_days,
                encoding="utf-8",
                utc=False,
            )
            file_handler.setFormatter(JsonFormatter())
            file_handler.addFilter(trace)
            file_handler.addFilter(redact)
            root.addHandler(file_handler)
        except OSError:
            logging.getLogger(__name__).warning(
                "File logging disabled — could not open %s; console only", logs_dir
            )

    for name in _NOISY:
        logging.getLogger(name).setLevel(logging.WARNING)

    _CONFIGURED = True
