# Service boundaries

Browser UI -> authorized backend -> tenant data store / invoice ledger -> gateway funding adapter + privy wallet adapter -> Arc ERC20 credit escrow (optional settlement).

Gateway balances represent supported cross-chain asset liquidity, not mutable arbitrary SaaS line items. A user pays by funding USDC, then service debits are journaled in a server-side double-entry ledger with immutable events. Periodic on-chain settlement can be implemented under user-approved caps, with explicit proof and dispute policies. Do not pretend a ledger update is an actual Circle Gateway transaction.

Suggested DB tables: tenants, memberships, users, wallets, strategies, strategy_versions, installations, entitlements, plans, subscriptions, invoices, invoice_lines, ledger_accounts, ledger_entries, gateway_deposits, gateway_transfers, signature_events, executions, approvals, purchases, ratings, withdrawals, settlements.

Every financial mutation requires a DB transaction, signature or Gateway event idempotency key, receipt status and reconciliation. Do not use browser balance as authority.
