# JWT Flow

## Token Types

|         | Access Token          | Refresh Token            |
| ------- | --------------------- | ------------------------ |
| Format  | JWT (signed)          | Random hex string        |
| Storage | Client memory         | HttpOnly cookie + DB     |
| Expiry  | 15 minutes            | 7 days                   |
| Purpose | Authenticate requests | Obtain new access tokens |

## Login Flow

1. Client sends email + password to `POST /auth/login`
2. Server verifies password against bcrypt hash in DB
3. Server creates a session record (device, IP, timestamp)
4. Server generates JWT access token with payload: `{ userId, email, roles }`
5. Server generates random refresh token, stores hash in DB linked to session
6. Server returns access token in response body
7. Server sets refresh token as HttpOnly, Secure, SameSite=Strict cookie

## Request Flow

1. Client attaches access token to every request: `Authorization: Bearer <token>`
2. Auth middleware verifies JWT signature using secret key
3. Auth middleware checks issuer (`authplane`) and audience (`authplane-client`)
4. If valid → attaches payload to `req.user` and calls `next()`
5. If invalid/expired → returns 401

## Refresh Flow

1. Access token expires after 15 minutes
2. Client calls `POST /auth/refresh` — browser sends HttpOnly cookie automatically
3. Server looks up refresh token in DB
4. Server checks: exists? not revoked? not expired?
5. Server revokes old refresh token (rotation)
6. Server issues new access token + new refresh token
7. New refresh token set as cookie, new access token returned in body

## Logout Flow

1. Client calls `POST /auth/logout`
2. Server revokes refresh token in DB (`is_revoked = TRUE`)
3. Server clears the HttpOnly cookie
4. Access token expires naturally after 15 minutes

## Token Rotation

Every `/refresh` call invalidates the old refresh token and issues a new one.
If a revoked token is used → reuse detected → session flagged as potentially stolen.

## JWT Payload Structure

```json
{
  "userId": "uuid",
  "email": "user@example.com",
  "roles": ["admin"],
  "iss": "authplane",
  "aud": "authplane-client",
  "sub": "uuid",
  "iat": 1234567890,
  "exp": 1234568790
}
```

## Security Notes

- Payload is base64 encoded, NOT encrypted — never store sensitive data in JWT
- Signature uses HS256 — verifiable without DB lookup
- Short expiry (15m) limits damage window if token is stolen
- Refresh token in HttpOnly cookie — not accessible via JavaScript (XSS protection)
