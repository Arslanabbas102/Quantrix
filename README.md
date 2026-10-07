# Quantrix

> **Derivative work notice:** Quantrix is a derivative of [**FinRobot**](https://github.com/AI4Finance-Foundation/FinRobot) by AI4Finance Foundation, licensed under Apache License 2.0. See [`NOTICE`](./NOTICE) and [`LICENSE`](./LICENSE) for full attribution and license terms. "FinRobot" and "AI4Finance" remain trademarks of AI4Finance Foundation; this project is not affiliated with or endorsed by them.

---

# Quantrix: An Open-Source AI Agent Platform for Financial Applications using Large Language Models
[![Downloads](https://static.pepy.tech/badge/finrobot)](https://pepy.tech/project/finrobot)
[![Downloads](https://static.pepy.tech/badge/finrobot/week)](https://pepy.tech/project/finrobot)
[![Join Discord](https://img.shields.io/badge/Discord-Join-blue)](https://discord.gg/trsr8SXpW5)
[![Python](https://img.shields.io/badge/python-3.10%20%7C%203.11-blue.svg)](https://www.python.org/downloads/)
[![PyPI](https://img.shields.io/pypi/v/finrobot.svg)](https://pypi.org/project/finrobot/)
![License](https://img.shields.io/github/license/AI4Finance-Foundation/finrobot.svg?color=brightgreen)
![](https://img.shields.io/github/issues-raw/AI4Finance-Foundation/finrobot?label=Issues)
![](https://img.shields.io/github/issues-closed-raw/AI4Finance-Foundation/finrobot?label=Closed+Issues)
![](https://img.shields.io/github/issues-pr-raw/AI4Finance-Foundation/finrobot?label=Open+PRs)
![](https://img.shields.io/github/issues-pr-closed-raw/AI4Finance-Foundation/finrobot?label=Closed+PRs)
[![Quantrix Desktop](https://img.shields.io/badge/Desktop-v0.1.0-blue)](https://github.com/AI4Finance-Foundation/FinRobot/releases/tag/desktop-v0.1.0)

<div align="center">
<img align="center" src=figs/logo_white_background.jpg width="40%"/>
</div>

**Quantrix** is an open-source **agentic AI framework for financial decision intelligence**. It combines foundation models with financial tools, quantitative models, deterministic computation, and multi-agent workflows to build decision-grade financial applications.

Its core principle is simple: **models reason, software computes, agents orchestrate, and systems verify.** Models can be replaced; the surrounding financial infrastructure — tools, workflows, validation, provenance, and evaluation — is what makes the system reliable.

Unlike the single-model paradigm of [**FinGPT**](https://github.com/AI4Finance-Foundation/FinGPT), Quantrix supports end-to-end agentic workflows for **equity research, quantitative trading, risk analysis, investment banking, private equity, wealth management, and other high-stakes financial decisions**.

[Whitepaper on arXiv](https://arxiv.org/abs/2405.14767) · [Official Academic Page](https://ai4finance.org/research/finrobot-open-source-ai-agent.html)

![Visitors](https://api.visitorbadge.io/api/VisitorHit?user=AI4Finance-Foundation&repo=FinRobot&countColor=%23B17A)
[![Discord](https://dcbadge.limes.pink/api/server/trsr8SXpW5?v=20260320)](https://discord.gg/trsr8SXpW5)

---

## Where to start

Quantrix is three projects sharing one financial domain layer. They are not three versions of the same thing competing for your attention — they serve different purposes.

| Directory | Version | What it is | Use it for |
|:---|:---|:---|:---|
| **[`quantrix_desktop/`](./quantrix_desktop/)** | V2 | **Production** — the real agent system. Native desktop research workstation on PydanticAI + FastAPI + React/Tauri | Actual research work. This is the one to use if you want output you can act on |
| **[`quantrix_equity/`](./quantrix_equity/)** | V1 | **Web app** — a self-hosted report generator with a FastAPI interface | Standing up a browser-based service that turns a ticker into a shareable HTML/PDF report |
| **[`quantrix_autogen/`](./quantrix_autogen/)** | V0 | **Educational** — the original AutoGen library, the codebase behind the whitepaper | Learning how financial agents are wired together, teaching, and reproducing the paper. Not intended for production use |

`pip install quantrix` installs the V0 package. Its source moved into `quantrix_autogen/`, but the import name did not change — every existing `from quantrix... import ...` keeps working.

---

## 🧬 Architecture Evolution

Quantrix evolves alongside the rapid development of AI-agent frameworks. Rather than being tied to a single agent stack, each generation explores how emerging agent architectures can improve financial analysis, research, and decision-making.

| Version | Agent Framework | Project | Maturity | Focus |
|---|---|---|---|---|
| **V0** | AutoGen | [`quantrix_autogen/`](./quantrix_autogen/) | Educational / reference | The original Quantrix multi-agent architecture for financial applications |
| **V1** | OpenAI Agents SDK | [`quantrix_equity/`](./quantrix_equity/) | Self-hosted web app | Equity-research agents, financial analysis, valuation, and automated report generation |
| **V2** | PydanticAI | [`quantrix_desktop/`](./quantrix_desktop/) | **Production** — also hosted at [finrobot.ai/v2](https://finrobot.ai/v2) | Structured, type-safe agent workflows for professional equity research |
| **V3** | DeepSeek-Harness | Quantrix V3 | In development | More autonomy inside the same verification constraints |

All three are open source. **V2 is the production system** — the deterministic compute engine, the provenance guarantees, and the agent orchestration described below all live there. V0 is kept because it is small enough to read and learn from, not because it is the recommended way to run research today.

> **Our philosophy:** Quantrix is not defined by any single agent framework. We continuously adopt, evaluate, and evolve with state-of-the-art agent architectures while keeping the financial domain layer — tools, workflows, deterministic computation, and decision-making capabilities — at the core.

---

## 🧮 Deterministic compute, LLM narration

A design principle that runs through every generation: **deterministic financial computation** and **LLM-based narration** stay strictly separate.

All financial numbers are produced by pure-Python compute operators, not by the language model. The LLM handles reasoning, synthesis, explanation, and report writing, while valuation outputs — DCF, DDM, LBO, WACC, comparable-company analysis, Monte Carlo simulation — are calculated through deterministic code paths with full provenance.

```
Numbers are code-calculated.
Narratives are LLM-assisted.
Every output is provenance-tracked.
```

---

## 🚀 Quantrix Desktop v0.1.0

A native desktop equity research cockpit powered by a production-grade multi-agent architecture. It takes analysts from market data and company filings to valuation, debate, synthesis, and investment-committee-style reports in one traceable workflow.

<div align="center">
<img src="figs/desktop-cockpit.png" width="92%" alt="Quantrix Desktop — the research cockpit: enter a ticker to open a fully traceable AI research desk"/>
</div>

<table>
<tr>
<td width="50%"><img src="figs/desktop-workspace.png" alt="Stock workspace: live market data on the left, the AI research verdict and valuation instruments on the right"/></td>
<td width="50%"><img src="figs/desktop-report.png" alt="A 13-chapter equity research report with its price target, confidence level and chapter navigation"/></td>
</tr>
<tr>
<td><b>Stock workspace</b> — live market data pulled independently of any AI report, beside the research verdict and the DCF / DDM / LBO / comps instruments.</td>
<td><b>Research report</b> — 13 chapters, a 12-month target with its range, model confidence, and the data caveats the audit operators raised.</td>
</tr>
</table>

<div align="center">
<img src="figs/desktop-dcf.png" width="92%" alt="DCF forecast table labelled code-computed, with WACC, terminal growth and tax rate, next to the LLM's narrative"/>
</div>

<p align="center"><i>The design principle, visible in the product: the DCF table is labelled <b>code-computed</b> — a ten-year forecast from pure-Python operators — while the paragraph beside it is the LLM reading those numbers back across all three valuation methods.</i></p>

👉 **Latest release:** [Quantrix Desktop v0.1.0](https://github.com/AI4Finance-Foundation/FinRobot/releases/tag/desktop-v0.1.0)

For macOS Apple Silicon (M1/M2/M3 or later), download `Quantrix_0.1.0_aarch64.dmg` and drag **Quantrix** into **Applications**. Intel Mac builds are not available in this release.

The app is not yet Apple-notarized, so on first launch macOS may report that it is "damaged." Run this once in Terminal, then open it normally:

```bash
xattr -cr "/Applications/Quantrix.app"
```

### Multi-agent architecture

A **Lead Agent** orchestrates specialized research agents through a pipeline-driven execution engine: five role-based sub-agents for data, analysis, modeling, synthesis, and reporting, plus three debate agents for the bull case, bear case, and judgment.

```
User Research Request
        ↓
Lead Agent / Orchestrator
        ↓
Data Agent → Analysis Agent → Modeling Agent → Synthesis Agent → Report Agent
        ↓
Bull Agent ↔ Bear Agent → Judge Agent
        ↓
Traceable Investment Research Output
```

### Codebase snapshot

| Layer | What it includes |
|---|---|
| **Full-stack system** | ~184k lines across a Python backend, React/Tauri desktop frontend, Rust shell, and tests |
| **Agent runtime** | 9 agents: lead orchestrator, 5 role-based pipeline agents, 3 debate agents |
| **Research pipelines** | 7 pipelines — company research, DCF, comps, LBO, DDM, earnings, IC memo |
| **Deterministic compute** | 32 pure-Python operators (26 valuation/analysis + 6 audit) and 7 coordinators |
| **Data infrastructure** | 7 providers with failover — FMP, Finnhub, yfinance, SEC EDGAR, Adanos, NewsAggregator, FX |
| **Skills** | 56 analyst playbooks across equity research, investment banking, private equity, and wealth management |
| **Product stack** | PydanticAI, FastAPI, SQLite, React 19, Vite 6, Zustand, Tauri/Rust, Recharts |

Full details in [`quantrix_desktop/README.md`](./quantrix_desktop/README.md).

---

## Getting started

### V2 — the desktop app, a local web UI, or the CLI

Three ways to run the same engine.

**Desktop app** — download the [release](https://github.com/AI4Finance-Foundation/FinRobot/releases/tag/desktop-v0.1.0) (macOS Apple Silicon).

**Local web UI** — the same interface in a browser, no `.dmg` and no Rust toolchain, so it also works on Intel Macs, Linux, and Windows:

```bash
cd quantrix_desktop
uv sync                        # backend dependencies
(cd desktop && npm install)    # frontend dependencies — one time

./dev.sh                       # → open http://localhost:5173
```

`dev.sh` runs the FastAPI backend on `:8321` and a Vite server on `:5173` that proxies the API to it; `Ctrl+C` stops both. Note that it first frees those two ports, so quit "Quantrix.app" if it is open, and that the local API is unauthenticated in browser mode — details in [`quantrix_desktop/README.md`](./quantrix_desktop/README.md).

**CLI** — after `uv sync` in `quantrix_desktop/`:

```bash
quantrix research AAPL          # full 13-chapter research artifact
quantrix dcf MSFT               # DCF valuation (auto-switches to DDM where appropriate)
quantrix comps NVDA --peers AMD,INTC
quantrix ic-memo TSLA
quantrix ask AAPL "How exposed is the gross margin to tariffs?"
```

Building the Tauri desktop shell is covered in [`quantrix_desktop/README.md`](./quantrix_desktop/README.md).

### V1 — the equity research web app

```bash
cp quantrix_equity/core/config/config.ini.example quantrix_equity/core/config/config.ini
# edit config.ini: fmp_api_key, openai_api_key, (optional) adanos_api_key

chmod +x quantrix_equity/deploy.sh
./quantrix_equity/deploy.sh start          # → http://127.0.0.1:8001
```

| Command | Description |
|:---|:---|
| `./quantrix_equity/deploy.sh start` | Start the web app (auto-installs dependencies) |
| `./quantrix_equity/deploy.sh stop` | Stop the application |
| `./quantrix_equity/deploy.sh restart` | Restart the application |
| `./quantrix_equity/deploy.sh status` | Check running status |
| `./quantrix_equity/deploy.sh install` | Install/update dependencies only |

If `deploy.sh` doesn't work in your environment:

```bash
python3 -m venv venv && source venv/bin/activate
pip install -r quantrix_equity/requirements.txt
python quantrix_equity/run_web_app.py
```

A two-step CLI pipeline is available as well — see [`quantrix_equity/README.md`](./quantrix_equity/README.md).

**Example reports:**
[NVDA](https://ai4finance-foundation.github.io/FinRobot/finrobot_equity/core/output/NVDA_Equity_Research_Report.html) ·
[MSFT](https://ai4finance-foundation.github.io/FinRobot/finrobot_equity/core/output/MSFT_Equity_Research_Report.html) ·
[TSLA](https://ai4finance-foundation.github.io/FinRobot/finrobot_equity/core/output/TSLA_Equity_Research_Report.html) ·
[META](https://ai4finance-foundation.github.io/FinRobot/finrobot_equity/core/output/META_Equity_Research_Report.html) ·
[COP](https://ai4finance-foundation.github.io/FinRobot/finrobot_equity/core/output/COP_Equity_Research_Report.html)

### V0 — the AutoGen framework

**1. Create an environment** (Python 3.10 or 3.11):

```bash
conda create --name quantrix python=3.10
conda activate quantrix
```

**2. Install** — from PyPI, or from source at the **repository root** (`setup.py` maps the `quantrix` package to `quantrix_autogen/quantrix`, so installing from inside that directory won't work):

```bash
git clone https://github.com/Arslanabbas102/Alpha-Desk-.git
cd Alpha-Desk-
pip install -e .          # or: pip install -U quantrix
```

**3. Configure keys** — both files go in `quantrix_autogen/`, which is where the notebooks look for them. Copy rather than rename: the `*_sample` files are tracked, and your filled-in copies are gitignored.

```bash
cd quantrix_autogen
cp OAI_CONFIG_LIST_sample OAI_CONFIG_LIST     # OpenAI / Azure OpenAI endpoints
cp config_api_keys_sample config_api_keys     # Finnhub, FMP, SEC, Reddit, …
```

**4. Run a tutorial** from `quantrix_autogen/tutorials_beginner/` or `tutorials_advanced/`:

```
agent_annual_report.ipynb        # 10-K → formatted PDF annual report
agent_fingpt_forecaster.ipynb    # market forecast from news + financials
agent_trade_strategist.ipynb     # strategy writing and backtesting
lmm_agent_mplfinance.ipynb       # multimodal agent reading a candlestick chart
lmm_agent_opt_smacross.ipynb     # multimodal SMA-crossover tuning
```

The agent library, workflow types, and full tutorial index are in [`quantrix_autogen/README.md`](./quantrix_autogen/README.md).

---

## Repository layout

```
Alpha-Desk-/
├── quantrix_autogen/          # V0 — AutoGen generation (PyPI: pip install quantrix)
│   ├── quantrix/              #   package root — imported as `quantrix`
│   │   ├── agents/              #     agent_library.py, workflow.py, prompts.py
│   │   ├── data_source/         #     finnhub / finnlp / fmp / sec / yfinance / reddit
│   │   ├── functional/          #     analyzer, charting, coding, quantitative, rag, text
│   │   ├── toolkits.py          #     registers Python functions as agent tools
│   │   └── utils.py
│   ├── tutorials_beginner/      #   hands-on tutorials
│   ├── tutorials_advanced/      #   advanced tutorials for Quantrix developers
│   ├── experiments/             #   investment group, multi-factor, portfolio optimization
│   ├── configs/ report/         #   agent configs and sample generated reports
│   ├── FinNLP/                  #   git submodule
│   ├── OAI_CONFIG_LIST_sample
│   ├── config_api_keys_sample
│   └── requirements.txt
│
├── quantrix_desktop/          # V2 — PydanticAI desktop generation (current)
│   ├── quantrix/              #   Python backend (FastAPI + compute engine)
│   │   ├── engine/              #     agents/, pipelines/, compute/, data/
│   │   ├── artifact/            #     report store + output contract gate
│   │   ├── audit/ coverage/ obs/ routes/
│   │   └── cli.py server.py sdk.py
│   ├── desktop/                 #   Tauri shell + React frontend (src/, src-tauri/)
│   ├── skills/                  #   56 analyst playbooks
│   ├── tests/ scripts/ tutorials/
│   └── pyproject.toml uv.lock dev.sh
│
├── quantrix_equity/           # V1 — OpenAI Agents SDK generation
│   ├── core/                    #   analysis engine + 8 section-writing agents
│   ├── web_app/                 #   FastAPI web application
│   ├── run_web_app.py           #   launcher
│   ├── deploy.sh                #   local deployment
│   ├── deploy.gcloud.sh         #   Cloud Run deployment
│   └── requirements.txt
│
├── Dockerfile .dockerignore     # V1 container build — must stay at the repo
│                                # root, since the image imports the app as
│                                # quantrix_equity.web_app.main
├── .github/workflows/           # desktop CI (backend 3.11/3.12, frontend Node 22/24)
├── setup.py                     # packages V0 (as `quantrix`) + V1 for PyPI
├── LICENSE NOTICE TRADEMARK_POLICY.md
└── README.md
```

---

## AI Agent papers

+ [Stanford University + Microsoft Research] [Agent AI: Surveying the Horizons of Multimodal Interaction](https://arxiv.org/abs/2401.03568)
+ [Stanford University] [Generative Agents: Interactive Simulacra of Human Behavior](https://arxiv.org/abs/2304.03442)
+ [Fudan NLP Group] [The Rise and Potential of Large Language Model Based Agents: A Survey](https://arxiv.org/abs/2309.07864)
+ [Fudan NLP Group] [LLM-Agent-Paper-List](https://github.com/WooooDyy/LLM-Agent-Paper-List)
+ [Tsinghua University] [Large Language Models Empowered Agent-based Modeling and Simulation: A Survey and Perspectives](https://arxiv.org/abs/2312.11970)
+ [Renmin University] [A Survey on Large Language Model-based Autonomous Agents](https://arxiv.org/pdf/2308.11432.pdf)
+ [Nanyang Technological University] [FinAgent: A Multimodal Foundation Agent for Financial Trading: Tool-Augmented, Diversified, and Generalist](https://arxiv.org/abs/2402.18485)

## AI Agent open-source frameworks & tools

+ [AutoGPT (183k stars)](https://github.com/Significant-Gravitas/AutoGPT): autonomous AI agent platform.
+ [Dify (134k stars)](https://github.com/langgenius/dify): LLM app development platform with workflow orchestration and RAG.
+ [LangChain (130k stars)](https://github.com/langchain-ai/langchain): framework for building context-aware LLM applications.
+ [MetaGPT (65.6k stars)](https://github.com/geekan/MetaGPT): multi-agent framework with role-based collaboration.
+ [AutoGen (56k stars)](https://github.com/microsoft/autogen): framework for multi-agent LLM applications with tools and human interaction.
+ [CrewAI (46.6k stars)](https://github.com/joaomdmoura/crewAI): framework for orchestrating collaborative AI agents.
+ [ChatDev (31.7k stars)](https://github.com/OpenBMB/ChatDev): multi-agent framework for software development tasks.
+ [FastGPT (27.4k stars)](https://github.com/labring/FastGPT): knowledge-based LLM platform with workflow support.
+ [Langfuse (23.4k stars)](https://github.com/langfuse/langfuse): open-source LLM observability and evaluation platform.
+ [BabyAGI (22.2k stars)](https://github.com/yoheinakajima/babyagi): task-driven experimental autonomous agent framework.
+ [SuperAGI (17.3k stars)](https://github.com/TransformerOptimus/SuperAGI): developer-focused autonomous agent framework.
+ [CAMEL (16.4k stars)](https://github.com/camel-ai/camel): framework for cooperative and communicative AI agents.
+ [Bisheng (11.2k stars)](https://github.com/dataelement/bisheng): enterprise open-source LLM application platform.

## Citing FinRobot

```bibtex
@article{yang2024finrobot,
  title   = {FinRobot: An Open-Source AI Agent Platform for Financial Applications using Large Language Models},
  author  = {Yang, Hongyang and Zhang, Boyu and Wang, Neng and Guo, Cheng and Zhang, Xiaoli and Lin, Likun and Wang, Junlin and Zhou, Tianyu and Guan, Mao and Zhang, Runjia and Wang, Christina Dan},
  journal = {arXiv preprint arXiv:2405.14767},
  year    = {2024},
  doi     = {10.48550/arXiv.2405.14767},
  url     = {https://arxiv.org/abs/2405.14767}
}

@inproceedings{zhou2024finrobot,
  title     = {FinRobot: {AI} Agent for Equity Research and Valuation with Large Language Models},
  author    = {Tianyu Zhou and Pinqiao Wang and Yilin Wu and Hongyang Yang},
  booktitle = {ICAIF 2024: The 1st Workshop on Large Language Models and Generative AI for Finance},
  year      = {2024}
}

@inproceedings{han2024enhancing,
  title     = {Enhancing Investment Analysis: Optimizing AI-Agent Collaboration in Financial Research},
  author    = {Han, Xuewen and Wang, Neng and Che, Shangkun and Yang, Hongyang and Zhang, Kunpeng and Xu, Sean Xin},
  booktitle = {ICAIF 2024: Proceedings of the 5th ACM International Conference on AI in Finance},
  pages     = {538--546},
  year      = {2024}
}
```

## License

Apache 2.0 — see [LICENSE](./LICENSE). Trademark usage is covered by [TRADEMARK_POLICY.md](./TRADEMARK_POLICY.md).

**Disclaimer**: The code and documents provided here are released under the Apache-2.0 license. They should not be construed as financial advice or recommendations for live trading. Exercise caution and consult qualified financial professionals before any trading or investment decisions.

<div align="center">
<img align="center" width="30%" alt="image" src="https://github.com/AI4Finance-Foundation/FinGPT/assets/31713746/e0371951-1ce1-488e-aa25-0992dafcc139">
</div>
