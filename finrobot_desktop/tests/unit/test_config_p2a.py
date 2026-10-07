from alpha_desk.config import AlphaDeskSettings


# Config is app-stored-only — AlphaDeskSettings reads constructor kwargs only,
# never env / .env — so a bare construction always reflects class defaults
# regardless of the developer's shell.
def _defaults_only() -> AlphaDeskSettings:
    return AlphaDeskSettings(model_name="test:test")


def test_fmp_api_key_default_empty():
    s = _defaults_only()
    assert s.fmp_api_key == ""


def test_finnhub_api_key_default_empty():
    s = _defaults_only()
    assert s.finnhub_api_key == ""


def test_sec_user_agent_default():
    s = _defaults_only()
    assert "Alpha Desk" in s.sec_user_agent
    assert "@" in s.sec_user_agent


def test_fmp_api_key_from_kwargs():
    s = AlphaDeskSettings(model_name="test:test", fmp_api_key="abc123")
    assert s.fmp_api_key == "abc123"
