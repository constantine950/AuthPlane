# API Reference

## Base URL

http://localhost:3000/api

## Authentication

Protected routes require a Bearer token in the Authorization header:
Authorization: Bearer <accessToken>

---

## Auth Endpoints

### POST /auth/register

Register a new user.

**Body:**

```json
{ "email": "user@example.com", "password": "password123" }
```

**Response:** `201`

```json
{
  "success": true,
  "message": "User registered successfully",
  "user": { "id": "...", "email": "..." }
}
```

**Errors:** `400` missing fields, `409` email exists

---

### POST /auth/login

Login and receive tokens.

**Body:**

```json
{ "email": "user@example.com", "password": "password123" }
```

**Response:** `200`

```json
{ "success": true, "accessToken": "eyJ..." }
```

Sets `refreshToken` as HttpOnly cookie.

**Errors:** `401` invalid credentials, `429` rate limit exceeded

---

### POST /auth/refresh

Get a new access token using the refresh token cookie.

**Cookie:** `refreshToken` (automatic)

**Response:** `200`

```json
{ "success": true, "accessToken": "eyJ..." }
```

Rotates refresh token — sets new cookie.

**Errors:** `401` missing/invalid/revoked/expired token

---

### POST /auth/logout

Logout and revoke refresh token.

**Cookie:** `refreshToken` (automatic)

**Response:** `200`

```json
{ "success": true, "message": "Logged out successfully" }
```

---

## Session Endpoints

All require `Authorization: Bearer <token>`

### GET /sessions

Get all active sessions for the current user.

**Response:** `200`

```json
{
  "success": true,
  "sessions": [
    {
      "id": "...",
      "device": "Chrome on Windows",
      "ip_address": "::1",
      "last_active": "2026-06-01T...",
      "created_at": "2026-06-01T..."
    }
  ]
}
```

---

### DELETE /sessions/:sessionId

Revoke a specific session.

**Response:** `200`

```json
{ "success": true, "message": "Session revoked successfully" }
```

**Errors:** `404` session not found

---

### DELETE /sessions

Revoke all sessions for the current user.

**Response:** `200`

```json
{ "success": true, "message": "All sessions revoked" }
```

---

## Role Endpoints

All require `Authorization: Bearer <token>`

### GET /roles

Get all available roles. (authenticated)

**Response:** `200`

```json
{ "success": true, "roles": [{ "id": "...", "name": "admin" }] }
```

---

### GET /roles/user/:userId

Get roles for a specific user. (authenticated)

**Response:** `200`

```json
{ "success": true, "roles": [{ "id": "...", "name": "user" }] }
```

---

### POST /roles/user/:userId

Assign a role to a user. (admin only)

**Body:**

```json
{ "role": "moderator" }
```

**Response:** `200`

```json
{ "success": true, "message": "Role 'moderator' assigned successfully" }
```

**Errors:** `404` user/role not found, `409` already assigned

---

### DELETE /roles/user/:userId

Remove a role from a user. (admin only)

**Body:**

```json
{ "role": "moderator" }
```

**Response:** `200`

```json
{ "success": true, "message": "Role 'moderator' removed successfully" }
```

**Errors:** `400` cannot remove last role/last admin

---

## User Endpoints

All require `Authorization: Bearer <token>` and `admin` role

### GET /users

Get all users with their roles.

**Response:** `200`

```json
{
  "success": true,
  "users": [
    { "id": "...", "email": "...", "roles": ["admin"], "created_at": "..." }
  ]
}
```

---

### DELETE /users/:userId

Delete a user and all their sessions/tokens.

**Response:** `200`

```json
{ "success": true, "message": "User deleted successfully" }
```

---

## Service Endpoints

### POST /service/verify-token

Verify a JWT access token. Requires `x-api-key` header.

**Headers:** `x-api-key: <apiKey>`

**Body:**

```json
{ "token": "eyJ..." }
```

**Response:** `200`

```json
{
  "success": true,
  "valid": true,
  "user": { "userId": "...", "email": "...", "roles": ["user"] }
}
```

---

### GET /service/user/:userId

Get user info by ID. Requires `x-api-key` header.

**Headers:** `x-api-key: <apiKey>`

**Response:** `200`

```json
{
  "success": true,
  "user": { "id": "...", "email": "...", "roles": ["user"] }
}
```

---

### POST /service/api-keys

Generate a new API key. (admin only)

**Body:**

```json
{ "name": "dashboard-service" }
```

**Response:** `201`

```json
{
  "success": true,
  "message": "API key generated. Store this key safely — it will not be shown again.",
  "key": "abc123...",
  "name": "dashboard-service"
}
```

---

## Audit Endpoints

Requires `Authorization: Bearer <token>` and `admin` role

### GET /audit

Get audit logs.

**Query:** `?limit=50` (optional, default 50)

**Response:** `200`

```json
{
  "success": true,
  "logs": [
    {
      "id": "...",
      "email": "test@example.com",
      "action": "login",
      "ip_address": "::1",
      "metadata": { "device": "Chrome" },
      "created_at": "..."
    }
  ]
}
```

---

## Error Format

All errors follow this shape:

```json
{ "success": false, "message": "Error description" }
```

## Status Codes

| Code | Meaning               |
| ---- | --------------------- |
| 200  | Success               |
| 201  | Created               |
| 400  | Bad request           |
| 401  | Unauthorized          |
| 403  | Forbidden             |
| 404  | Not found             |
| 409  | Conflict              |
| 429  | Rate limit exceeded   |
| 500  | Internal server error |
