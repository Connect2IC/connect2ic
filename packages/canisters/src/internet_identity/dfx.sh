#!/usr/bin/env bash
set -euo pipefail

# deploy ledger contract
echo ">>>>>> Deploying Internet Identitty"

II_FETCH_ROOT_KEY=1 dfx deploy --no-wallet --argument '(null)'