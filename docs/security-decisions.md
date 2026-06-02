# Security Decisions

## Password Hashing — bcrypt

Passwords are hashed with bcrypt (salt rounds: 10).

- One-way hash — cannot be reversed
- Random salt per password — same password produces different hashes
- Salt rounds = 10 — industry standard balance of security vs performance
- Salt is embedded in the hash — no separate storage needed

## JWT — Short Expiry

Access tokens expire in 15 minutes.

- Limits damage window if a token is stolen
- Stateless — no DB lookup on every request
- Cannot be invalidated early — accepted tradeoff for performance

## Refresh Token — HttpOnly Cookie + DB

- HttpOnly — JavaScript cannot read it (XSS protection)
- Secure — only sent over HTTPS in production
- SameSite=Strict — CSRF protection
- Stored in DB — can be revoked instantly server-side
- Random hex string (not JWT) — no information exposure

## Token Rotation

Every refresh invalidates the old token and issues a new one.

- Limits refresh token lifetime to one use
- Reuse detection — if a revoked token is used, potential theft is flagged

## Rate Limiting

- Login: 5 attempts per 15 minutes per IP
- Register: 10 attempts per hour per IP
- Global: 100 requests per 15 minutes per IP
- Prevents brute force attacks on login endpoint

## RBAC — Role-Based Access Control

- Roles stored in DB — `admin`, `user`, `moderator`, `service`
- Roles embedded in JWT — no DB lookup on every request
- Enforced at middleware level — before controllers run
- Cannot remove last admin — prevents lockout

## API Keys — Service Authentication

- Random 32-byte hex string
- Stored as SHA-256 hash in DB — raw key never stored
- Sent in `x-api-key` header
- SHA-256 used instead of bcrypt — API keys are long random strings, rainbow tables not a concern, speed matters for per-request checks

## Error Messages

- Login always returns `"Invalid credentials"` — never specifies email vs password
- Prevents user enumeration attacks

## Audit Logs

- All login, logout, role changes logged with IP and timestamp
- `ON DELETE SET NULL` — logs preserved even if user is deleted
- Admin only access
