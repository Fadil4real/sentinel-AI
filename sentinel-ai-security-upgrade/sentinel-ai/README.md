# Sentinel AI — Security-first NEAR hackathon prototype

Sentinel AI is a prototype transaction guard for AI agents. This version prioritizes explainable, rule-based threat indicators and a safe, read-only connection check to NEAR testnet.

## Features in this version

- **Threat detection workspace:** scans pasted untrusted text for instruction override attempts, requests to bypass safety checks, secret/credential disclosure, concealment language, urgency pressure, and broad fund-transfer language.
- **Explainable risk score:** each matched local rule adds points and displays its reason. The score is a heuristic, not a calibrated probability or a guarantee of safety.
- **Transaction policy demo:** spending limit, destination allowlist, review state, and emergency stop remain local simulation features.
- **NEAR testnet status check:** sends a read-only `status` JSON-RPC request to `https://rpc.testnet.near.org` and displays network metadata when reachable.
- **Audit CSV export** and browser-local persistence for demo settings and activity.
- **Responsive UI** with a simpler threat-analysis flow and clear labels distinguishing implemented checks from planned features.

## Run locally

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm run preview
```

## Safety and implementation status

- Threat detection is a **local deterministic heuristic**. It does not call an AI model, and it cannot reliably detect every prompt injection or malicious action.
- NEAR integration currently checks public testnet RPC status only. It does **not** connect a wallet, create or manage keys, sign transactions, or submit transactions.
- Function Call Key authorization, contract-level enforcement, Sybil/coordination analysis, AI-based classifiers, MPC/TEE, staking, slashing, and live bounty/micro-payment flows are **not implemented yet**.
- No mainnet funds are used. Do not enter seed phrases, private keys, API secrets, or other credentials into the prototype.
- This is a hackathon demonstration, not an audited security product. A low score must not be treated as proof that an instruction is safe.

## NEAR resources

- [NEAR developer documentation](https://docs.near.org/)
- [NEAR testnet explorer](https://testnet.nearblocks.io/)
- [NEAR Hackathon](https://nearhackathon.com/)
