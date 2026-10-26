# Agent Wallets — Next.js strategy marketplace starter

A working **local simulation**, modeled on the dark strategy-dashboard mockup. No keys required. This is a prototype, **not a deployed multi-tenant billing system**.

## Run

```bash
npm install
npm run dev
```

Open http://localhost:3000. Optional: copy `.env.example` to `.env.local` before integrating providers. No env vars are required for demo mode.

## What works now

- Responsive strategy dashboard, visual metrics, sample charts, activity timeline
- Desktop/mobile sidebar, strategy instances, start/stop state changes, deposit/withdraw simulations
- Strategy marketplace with categories, installation, simulated subscription unlocks
- Publish a new listing for a simulated $1 credit charge
- Post-purchase 1–5 star rating **saved for the local session/browser**
- Demo server wallet provisioning with a $3 balance debit and chain selection
- Demo prepaid credits, top-ups, signature pricing display, 20% revenue split calculations
- Dark and light theme, localStorage persistence, production integration flag controls
- Ethereum (1), Base (8453), Arbitrum (42161), Optimism (10), Polygon (137), Avalanche (43114), Unichain (130), Arc (5042)
- `contracts/ArcPrepaidLedger.sol` reference prepaid USDC credit escrow with daily spend caps, withdrawability and duplicate-charge prevention

## Critical limitations

**There is NO live wallet creation, strategy execution, blockchain transaction, subscription collection, escrow deposit, Circle Gateway call, Privy authentication, actual P&L computation, tenant isolation, or trusted purchase verification in this demo.** `Production integration switches` record preferences only. Fake wallet addresses and mock charts are explicitly labeled. Do **not** deploy the contract as-is: it's unaudited, the batch method deliberately reverts, and it lacks production payment authorization and dispute protocols.

Locally published strategies also persist across page reloads in that browser. Ratings require a locally marked purchase; this is not tamper-proof and needs server-side verification.

## Architecture for real production

- Privy Auth: provision authenticated tenants/users, authorization roles, signing policies, and secure server-wallet lifecycle. NEVER put signing credentials in `NEXT_PUBLIC_*`.
- Payments: use **Circle Gateway** for USDC liquidity deposits/withdrawals and cross-chain settlement **where chain support is verified**. Gateway is not itself a database of each SaaS customer's spending balance. A credit ledger on Arc + independently verified offchain metering is required.
- Circle Gateway docs: https://developers.circle.com/gateway
- On Arc mainnet, network ID is 5042. Arc USDC ERC20 reference address `0x3600000000000000000000000000000000000000`, six decimals. Arc native gas USDC representation uses a different decimal scale: NEVER mix native-value and ERC20 units.
- Separate **wallet funds** from **prepaid platform service credits**. Avoid ever mixing customer trading assets with operational balances.
- Meter signatures using a tamper-proof server event ledger (idempotency key, tenant/user/wallet, chain, provider request ID, UTC timestamp, units, fee schedule version). Batched billing can save on-chain gas, but offchain accounting needs reproducible statements and customer caps.
- For recurring strategy access, use entitlements with period, developer, tenant, wallet licensing policy, proration, revocation, renewals, grace intervals and royalty ledger. Distribute developer/platform proceeds after funds clear, refund windows and tax/processor deductions as applicable.
- Purchases/ratings: backend purchase proof and one verified rating per purchased strategy per user, edits allowed, anti-sybil and abuse controls.
- A multi-tenant backend must apply row-level policies so tenant A cannot see/control tenant B's wallets, strategies or funds.
- Any agent must run behind **hard policy gates**, never accept arbitrary executable code or unchecked natural-language approvals. Deposit/withdraw flows require independent wallet authorization and audit logs.
- Never bill a user for a failed attempt without a documented billing rule. Treat retries and webhook replays idempotently.
- Chain support in the selector does **not** imply Circle Gateway supports every chain or asset route; check current Gateway support independently.

## Production build phases

1. Auth & database: Privy IDs, tenant/user/roles; Postgres/RLS tables for wallets, strategy versions, installs, entitlements, rating proofs, journal entries.
2. Wallet lifecycle: Privy server SDK in secure API routes; signing policies, explicit wallet approval and on-chain balances, webhook retries.
3. Financial ledger: double-entry credit accounting in integer USDC micro-units, Gateway route adapters, deposit confirmation and reconciliation.
4. Subscription billing: per-wallet/per-user license rules, scheduled charge generation, invoice idempotency, 20% developer commission, publishing and creation fees.
5. Agent runtime: isolated workers + jobs, approved protocol adapters, explicit spending/contract limitations; separate monitoring from execution.
6. Arc settlement: deploy an audited USDC escrow, configurable per-user authorization and risk caps, batch settlement and receipts, operator multisig and emergency pause.
7. Testing & audit: adversarial tests, policy isolation, wallet permission tests, security review, financial compliance review.

### Pricing defaults

- User account: $1 / month
- New server wallet: $3 one time
- Strategy publishing: $1 one time
- Wallet signature: $0.011
- Strategy subscriptions: creator-set monthly price, 20% platform commission

All defaults are configurable in the **Settings** screen but must be fixed, versioned and enforced server-side before production.
