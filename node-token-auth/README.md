# node-token-auth

A token-based authentication REST API built with Node.js and JWT, developed as part of the WEB102 lab at the College of Science and Technology, Royal University of Bhutan.

---

## What It Does

This project implements a simple but complete authentication system with:

- User registration with hashed passwords
- Login with JWT token generation
- Protected routes that require a valid token
- A public endpoint to list registered users (without passwords)

---

## Tech Stack

| Package | Purpose |
|---------|---------|
| Node.js | Runtime environment |
| Express | HTTP server and routing |
| jsonwebtoken | Sign and verify JWT tokens |
| bcryptjs | Hash and compare passwords |
| dotenv | Load environment variables |

---

## Project Structure

```
node-token-auth/
├── .env                     # Environment variables (not committed)
├── server.js                # Entry point
├── routes/
│   ├── auth.js              # Register, login, and users routes
│   └── protected.js         # Protected profile route
└── middleware/
    └── verifyToken.js       # JWT verification middleware
```

---

## Getting Started

### Prerequisites

- Node.js installed on your machine
- VS Code with Thunder Client extension (for testing)

### Installation

```bash
# Clone or download the project folder, then:
cd node-token-auth
npm install
```

### Environment Setup

Create a `.env` file in the root folder:

```
JWT_SECRET=supersecretkey123
PORT=3000
```

> Never commit your `.env` file to GitHub. Add it to `.gitignore`.

### Run the Server

```bash
node server.js
```

You should see:

```
Server running on http://localhost:3000

Available endpoints:
  POST /auth/register
  POST /auth/login
  GET  /profile
```

---

## API Endpoints

### POST /auth/register

Register a new user.

**Request body:**
```json
{
  "name": "Pelden",
  "email": "student@test.com",
  "password": "123456"
}
```

**Response (201):**
```json
{
  "message": "User registered successfully!"
}
```

---

### POST /auth/login

Login and receive a JWT token.

**Request body:**
```json
{
  "email": "student@test.com",
  "password": "123456"
}
```

**Response (200):**
```json
{
  "message": "Login successful!",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

### GET /profile *(Protected)*

Access a protected route. Requires a valid JWT token in the header.

**Headers:**
```
Authorization: Bearer <your_token_here>
```

**Response (200):**
```json
{
  "message": "Welcome! You accessed a protected route.",
  "user": {
    "id": 1,
    "email": "student@test.com",
    "iat": 1779123342,
    "exp": 1779209742
  }
}
```

**Without token → 401:**
```json
{ "message": "Access denied. No token provided." }
```

**Fake/expired token → 403:**
```json
{ "message": "Invalid or expired token." }
```

---

### GET /auth/users

Returns all registered users. No token required.

**Response (200):**
```json
[
  {
    "id": 1,
    "name": "Pelden",
    "email": "student@test.com"
  }
]
```

> Passwords are never exposed in this response.

---

## HTTP Status Codes Used

| Code | Meaning | When |
|------|---------|------|
| 200 | OK | Login or profile access succeeded |
| 201 | Created | User registered |
| 400 | Bad Request | Missing fields in request body |
| 401 | Unauthorized | No token provided |
| 403 | Forbidden | Token invalid or expired |
| 409 | Conflict | Email already registered |

---

## How JWT Works

After login, the server signs a token using the `JWT_SECRET`:

```
HEADER.PAYLOAD.SIGNATURE
```

The payload contains `{ id, email, iat, exp }`. Anyone can decode the payload — but only the server can create a valid signature. This is why you should **never put passwords or sensitive data in a JWT**.

You can inspect any token at [https://jwt.io](https://jwt.io).

---

## Notes

- User data is stored in-memory (no database). All users are lost when the server restarts.
- Tokens expire after **1 day**.
- This project is for learning purposes. In production, always use HTTPS and store secrets securely.

