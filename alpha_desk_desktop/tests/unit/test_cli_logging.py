import pathlib


def test_cli_module_has_no_basicconfig_call() -> None:
    src = pathlib.Path("alpha_desk/cli.py").read_text()
    assert "logging.basicConfig" not in src, "CLI must route through obs.setup_logging"
