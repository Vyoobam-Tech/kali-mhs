## Quick Start Guide - Testing Authentication API

### Prerequisites
- MongoDB running (local or Atlas)
- Backend server running (`npm run dev` in backend folder)

### API Endpoints

Base URL: `http://localhost:5000/api/v1`

---

### 1. Register a New User

**POST** `/auth/register`

**Body:**
```json
{
  "email": "admin@kalimhs.com",
  "password": "Admin@123456",
  "firstName": "John",
  "lastName": "Doe",
  "role": "SUPER_ADMIN"
}
```

**Response:**
```json
{
  "status": "success",
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "...",
      "email": "admin@kalimhs.com",
      "firstName": "John",
      "lastName": "Doe",
      "fullName": "John Doe",
      "role": "SUPER_ADMIN",
      "status": "ACTIVE",
      "createdAt": "...",
      "updatedAt": "..."
    },
    "tokens": {
      "accessToken": "eyJhbGc...",
      "refreshToken": "eyJhbGc...",
      "expiresIn": 604800
    }
  }
}
```

---

### 2. Login

**POST** `/auth/login`

**Body:**
```json
{
  "email": "admin@kalimhs.com",
  "password": "Admin@123456"
}
```

**Response:** Same as register

---

### 3. Get Profile (Protected)

**GET** `/auth/profile`

**Headers:**
```
Authorization: Bearer <your_access_token>
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "user": {
      "id": "...",
      "email": "admin@kalimhs.com",
      "firstName": "John",
      "lastName": "Doe",
      "fullName": "John Doe",
      "role": "SUPER_ADMIN",
      "status": "ACTIVE"
    }
  }
}
```

---

### 4. Refresh Token

**POST** `/auth/refresh`

**Body:**
```json
{
  "refreshToken": "<your_refresh_token>"
}
```

**Response:**
```json
{
  "status": "success",
  "message": "Token refreshed successfully",
  "data": {
    "tokens": {
      "accessToken": "eyJhbGc...",
      "refreshToken": "eyJhbGc...",
      "expiresIn": 604800
    }
  }
}
```

---

### 5. Change Password (Protected)

**POST** `/auth/change-password`

**Headers:**
```
Authorization: Bearer <your_access_token>
```

**Body:**
```json
{
  "currentPassword": "Admin@123456",
  "newPassword": "NewAdmin@123456"
}
```

**Response:**
```json
{
  "status": "success",
  "message": "Password changed successfully"
}
```

---

### 6. Logout (Protected)

**POST** `/auth/logout`

**Headers:**
```
Authorization: Bearer <your_access_token>
```

**Response:**
```json
{
  "status": "success",
  "message": "Logged out successfully. Please remove tokens from client."
}
```

---

### Testing with cURL

**Register:**
```bash
curl -X POST http://localhost:5000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@kalimhs.com","password":"Admin@123456","firstName":"John","lastName":"Doe","role":"SUPER_ADMIN"}'
```

**Login:**
```bash
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@kalimhs.com","password":"Admin@123456"}'
```

**Get Profile:**
```bash
curl -X GET http://localhost:5000/api/v1/auth/profile \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

### Password Requirements

- Minimum 8 characters
- At least one uppercase letter (A-Z)
- At least one lowercase letter (a-z)
- At least one number (0-9)
- At least one special character (!@#$%^&*(),.?":{}|<>)

---

### User Roles

- `SUPER_ADMIN`: Full system access
- `ADMIN`: Administrative access
- `EDITOR`: Limited content editing access

---

### Error Responses

**Validation Error:**
```json
{
  "status": "error",
  "statusCode": 400,
  "message": "Validation failed",
  "correlationId": "...",
  "errors": [
    {
      "field": "body.email",
      "message": "Invalid email address"
    }
  ]
}
```

**Authentication Error:**
```json
{
  "status": "error",
  "statusCode": 401,
  "message": "Invalid email or password",
  "correlationId": "..."
}
```

**Authorization Error:**
```json
{
  "status": "error",
  "statusCode": 403,
  "message": "Access denied. Admin role or above required.",
  "correlationId": "..."
}
```
