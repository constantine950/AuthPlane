# Auth Service — Product Requirements Document

## What is this?

A standalone Auth service that manages user identity, access control, and secure
session handling across multiple applications. It exists as a separate service so
that any app in the system can delegate authentication to one trusted place instead
of each app managing its own login logic.

## Problems it solves

- Security bugs in auth logic have to be fixed in every app separately when auth
  is baked in — one central service means one fix
- No way for multiple apps to share user identity or know about each other's sessions
- Codebase gets bloated and harder to maintain when auth is mixed with
  business logic

## Core Concepts

### Access Token

A short-lived JWT (15 mins) that proves who you are on each request. Like a
view-once message — it expires fast, so if stolen, the damage is limited to
a small time window and cannot be extended.

### Refresh Token

A long-lived token stored in the database, used only to obtain a new access token
when the current one expires. The user stays logged in without re-entering their
password, but the refresh token can be revoked instantly from the DB.

**Storage:** Sent as an `HttpOnly` cookie (JS cannot read it) and saved in the DB
— the cookie protects against XSS, the DB record allows server-side revocation.

### Stateless vs Stateful

- Stateless (JWT): the token carries all user info inside it. No DB lookup needed
  on every request — fast. But cannot be invalidated before it expires.
- Stateful (sessions): session data lives in the DB. Can be killed instantly,
  but every request costs a DB lookup.
- This service uses both: JWT for speed on every request, refresh tokens in the
  DB so sessions can be revoked (logout, stolen token, admin force-logout).

## What this service will do

- User registration and login
- JWT access token issuance
- Refresh token flow (issue, rotate, revoke)
- Role-based access control (RBAC)
- Session tracking (device, IP, last active)
- Multi-device session management
- Token verification endpoint for other services
- Admin dashboard for user/role/session management

## What this service will NOT do (out of scope)

- OAuth / third-party login (Google, GitHub) — separate concern
- User profile data (name, avatar, address) — belongs in a profile service
- Email sending (password reset emails, welcome emails) — separate service
- Payment or subscription logic
- App-specific business logic of any kind

## Success criteria

- Any external app can verify a user by calling this service
- JWT + refresh token flow works with proper rotation and revocation
- Roles can be assigned and enforced across routes
- Active sessions are visible and revocable per device
- Admin dashboard exposes user, role, and session management
