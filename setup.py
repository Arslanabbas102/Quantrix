from setuptools import setup, find_packages

# V0 (AutoGen) 的包本体已移入 quantrix_autogen/,但对外 import 名仍是 `quantrix`
_V0_PKG_DIR = "quantrix_autogen/quantrix"

# Read requirements.txt, ignore comments
try:
    with open("quantrix_autogen/requirements.txt", "r") as f:
        REQUIRES = [line.split("#", 1)[0].strip() for line in f if line.strip()]
except:
    print("'quantrix_autogen/requirements.txt' not found!")
    REQUIRES = list()

setup(
    name="quantrix",
    version="0.1.5",
    include_package_data=True,
    author="AI4Finance Foundation",
    author_email="contact@ai4finance.org",
    url="https://github.com/AI4Finance-Foundation/FinRobot",
    license="Apache-2.0",
    packages=(
        ["quantrix"]
        + [f"quantrix.{_p}" for _p in find_packages(where=_V0_PKG_DIR)]
        + find_packages(include=["quantrix_equity", "quantrix_equity.*"])
    ),
    package_dir={"quantrix": _V0_PKG_DIR},
    install_requires=REQUIRES,
    description="Quantrix: An Open-Source AI Agent Platform for Financial Applications using LLMs",
    long_description="""Quantrix""",
    classifiers=[
        # Trove classifiers
        # Full list: https://pypi.python.org/pypi?%3Aaction=list_classifiers
        "License :: OSI Approved :: Apache Software License",
        "Programming Language :: Python",
        "Programming Language :: Python :: 3",
        "Programming Language :: Python :: 3.6",
        "Programming Language :: Python :: 3.7",
        "Programming Language :: Python :: 3.8",
        "Programming Language :: Python :: 3.9",
        "Programming Language :: Python :: 3.10",
        "Programming Language :: Python :: 3.11",
        "Programming Language :: Python :: Implementation :: CPython",
        "Programming Language :: Python :: Implementation :: PyPy",
    ],
    keywords="Financial Large Language Models, AI Agents",
    platforms=["any"],
    python_requires=">=3.10, <3.12",
)
