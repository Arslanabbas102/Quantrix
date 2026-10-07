"""Observability: structured runtime logging with trace propagation."""

from alpha_desk.obs.context import (
    bind_request,
    bind_run,
    bind_session,
    current_trace,
)
from alpha_desk.obs.filters import TraceFilter
from alpha_desk.obs.formatters import HumanFormatter, JsonFormatter
from alpha_desk.obs.setup import setup_logging

__all__ = [
    "HumanFormatter",
    "JsonFormatter",
    "TraceFilter",
    "bind_request",
    "bind_run",
    "bind_session",
    "current_trace",
    "setup_logging",
]
