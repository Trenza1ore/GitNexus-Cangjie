#!/usr/bin/env bash
# tree-sitter >=0.25 builds from source and ships with C++17 in binding.gyp; Node.js 24+
# headers require C++20. Export this before npm install on Darwin/Linux when using Node 22+.
set -euo pipefail
export CXXFLAGS="${CXXFLAGS:--std=c++20}"
exec npm install "$@"
