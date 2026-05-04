# Auth Service — Architecture

## System Overview

## Login Flow

1. Client sends `POST /login` with email and password
2. Auth Service looks up user by email in DB — returns 401 if not found
3. Auth Service compares submitted password against stored hashed password — returns 401 if wrong
4. Auth Service generates an access token (JWT, signed with secret key) and a refresh token
5. DB stores the refresh token record (linked to user + device/IP for session tracking)
6. Auth Service returns:
   - Body → `{ accessToken }` with status 200
   - Cookie → `refreshToken` as HttpOnly, Secure, SameSite=Strict

## Verification Flow

1. Client sends request to App B with access token in the `Authorization: Bearer <token>` header
2. App B extracts the token and verifies the JWT signature locally using the shared secret key
3. If valid and not expired → App B handles the request, no Auth Service call needed
4. If invalid or expired → App B returns 401, client uses refresh token to get a new access token
5. For services that can't verify locally → App B calls `POST /verify-token` on the Auth Service

## Refresh Token Flow

1. Client sends `POST /refresh` — browser automatically includes HttpOnly cookie
2. Auth Service checks refresh token exists in DB and is not revoked
3. Auth Service invalidates old refresh token, issues a new one (rotation)
4. Returns new access token in body, sets new refresh token cookie

## Where Things Live

| Thing         | Where                           |
| ------------- | ------------------------------- |
| Access token  | Response body → client memory   |
| Refresh token | HttpOnly cookie + PostgreSQL DB |
| User records  | PostgreSQL DB                   |
| Session info  | PostgreSQL DB                   |
| JWT secret    | Environment variable            |
