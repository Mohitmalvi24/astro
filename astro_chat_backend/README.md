# Auth API Testing Guide

## Endpoints

### 1. Register User
`POST /api/auth/register/`

**Body (JSON):**
```json
{
  "email": "user@example.com",
  "username": "astro_user",
  "password": "Password123!",
  "confirm_password": "Password123!"
}
```

**curl Example:**
```bash
curl -X POST http://127.0.0.1:8000/api/auth/register/ \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "username": "astro_user", "password": "Password123!", "confirm_password": "Password123!"}'
```

### 2. Login User
`POST /api/auth/login/`

**Body (JSON):**
```json
{
  "email": "user@example.com",
  "password": "Password123!"
}
```

**curl Example:**
```bash
curl -X POST http://127.0.0.1:8000/api/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "password": "Password123!"}'
```

### 3. Refresh Token
`POST /api/auth/refresh/`

**Body (JSON):**
```json
{
  "refresh": "<YOUR_REFRESH_TOKEN>"
}
```

### 4. Fetch Current Profile
`GET /api/auth/me/`

**Headers:**
`Authorization: Bearer <YOUR_ACCESS_TOKEN>`

**curl Example:**
```bash
curl -X GET http://127.0.0.1:8000/api/auth/me/ \
  -H "Authorization: Bearer <YOUR_ACCESS_TOKEN>"
```
