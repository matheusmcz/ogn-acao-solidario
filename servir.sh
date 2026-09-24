#!/usr/bin/env bash
# Sobe um servidor estático na raiz do projeto (necessário para ES Modules + SPA).
cd "$(dirname "$0")"
PORT="${1:-8080}"
echo "ONG Ação Solidária — http://localhost:${PORT}/html/index.html"
echo "Ctrl+C para encerrar."
python3 -m http.server "$PORT"
