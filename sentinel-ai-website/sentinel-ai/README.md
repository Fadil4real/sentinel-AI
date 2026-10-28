# Sentinel AI — Smart Transaction Guard

A responsive React/Vite prototype for a NEAR Hackathon AI Security & Defense project.

## What works in this prototype
- Dashboard with sample transaction activity and summary metrics.
- Transaction request simulator.
- Deterministic policy checks for maximum amount and approved destinations.
- Decision explanations and a local activity log.
- Approve/reject actions for requests awaiting human review.
- Editable policy limit and destination allowlist.
- Searchable transaction list.
- Responsive desktop and mobile layouts.

## Important scope note
This is a front-end demo. Data lives in React state and resets on refresh. It does **not** connect to a wallet, submit blockchain transactions, or provide audited security. The NEAR integration is a next development step.

## Run locally
1. Install Node.js (LTS).
2. Extract this project.
3. Open a terminal in the `sentinel-ai` folder.
4. Run:

```bash
npm install
npm run dev
```

5. Open the local URL printed by Vite.

## Build for deployment
```bash
npm run build
npm run preview
```

## Suggested next steps
1. Add a Node/Express API for policy evaluation.
2. Persist policies and audit events in SQLite or Supabase.
3. Add tests for policy rules.
4. Integrate one documented NEAR ecosystem component on testnet.
5. Record a demo showing a valid request, a blocked request, and a request requiring human review.

## Project safety
Never put wallet secrets or private API keys in frontend code. Keep policy decisions deterministic; AI-generated explanations must never override a blocked decision.
