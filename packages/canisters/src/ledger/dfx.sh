#!/usr/bin/env bash
set -euo pipefail

# deploy ledger contract
echo ">>>>>> Deploying ledger"

dfx deploy \
    --argument "record { minting_account = \"ea2d973e67dcbcb00f1cfb36d05d600eef68c7513c18dac8ef52d165c1d38c36\"; initial_values = vec { record { \"a32bf2912509d0561f3394009ba5b062ac3f607d6bf171f48841ebbc5005c82a\"; record { e8s = 18446744073709551615 } } }; max_message_size_bytes = null; transaction_window = null; archive_options = null; send_whitelist = vec {}}" \
    --network=local \
    --no-wallet \
    ledger