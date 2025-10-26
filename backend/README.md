# Identity - Authentication Backend

A Node.js/Express backend implementing **two authentication strategies**: Session-based and JWT-based authentication.

## Tech Stack

- **Runtime**: Node.js v24.7.0
- **Framework**: Express.js 5.1.0
- **Database**: PostgreSQL
- **ORM**: Prisma 6.17.1
- **Session Store**: connect-pg-simple
- **JWT**: jsonwebtoken
- **Password Hashing**: bcrypt

## Project Structure

```
backend/
├── src/
│   ├── auth-strategies/
│   │   ├── session/           # Session-based auth
│   │   │   ├── config/
│   │   │   ├── controllers/
│   │   │   ├── middleware/
│   │   │   └── routes/
│   │   └── jwt-simple/        # JWT-based auth
│   │       ├── controllers/
│   │       ├── middleware/
│   │       └── routes/
│   ├── config/
│   │   ├── cookie.js          # Cookie configuration
│   │   └── database.js        # Prisma client
│   ├── services/
│   │   └── authService.js     # Shared auth logic
│   └── utils/
│       └── validators.js      # Input validation
├── prisma/
│   └── schema.prisma          # Database schema
├── Dockerfile                 # Production image (multi-stage build)
├── Dockerfile.migrate         # Lightweight migration-only image
├── docker-compose.yml         # PostgreSQL + Backend orchestration
├── entrypoint.sh              # Container startup script (DB health check)
├── .dockerignore              # Excludes files from Docker context
└── server.js                  # Express app entry point
```

## Database Schema

**Users Table** (`users`):
- `id` (UUID, Primary Key)
- `email` (String, Unique)
- `password` (String, Hashed with bcrypt)
- `name` (String)
- `createdAt`, `updatedAt` (Timestamps)

**Session Table** (`session`):
- `sid` (String, Primary Key) - Session ID
- `sess` (JSON) - Session data
- `expire` (DateTime) - Expiration timestamp

## API Endpoints

### Session-Based Auth
- `POST /auth/register-session` - Register with session
- `POST /auth/login-session` - Login with session
- `GET /auth/profile-session` - Get profile (requires session cookie)
- `POST /auth/logout-session` - Logout (destroys session)

### JWT-Based Auth
- `POST /auth/register-jwt` - Register with JWT
- `POST /auth/login-jwt` - Login with JWT (returns token)
- `GET /auth/profile-jwt` - Get profile (requires JWT in cookie or Authorization header)
- `POST /auth/logout-jwt` - Logout (clears JWT cookie)

## Setup & Installation

### Option 1: Docker Setup (Recommended)

**Prerequisites:**
- Docker & Docker Compose installed

**Quick Start:**
1. **Build and run with Docker Compose**:
   ```bash
   docker-compose up --build
   ```
   This will:
   - Start PostgreSQL database (port 5432)
   - Build the backend image
   - Run migrations automatically
   - Start the backend server (port 3000)

2. **Environment variables** are configured in `docker-compose.yml` or create a `.env` file:
   ```env
   DATABASE_URL="postgresql://identity:random@123@db:5432/identity"
   PORT=3000
   NODE_ENV=production

   # Session Auth
   SESSION_SECRET="your-session-secret"
   SESSION_NAME=sessionId
   SESSION_MAX_AGE=86400000

   # JWT Auth
   JWT_SECRET="your-jwt-secret"

   BCRYPT_ROUNDS=10
   ```

**Docker Commands:**
```bash
# Start services
docker-compose up -d

# Stop services
docker-compose down

# View logs
docker-compose logs -f backend

# Rebuild after code changes
docker-compose up --build

# Run migrations only
docker run --rm --network identity_app-network \
  -e DATABASE_URL="postgresql://identity:random@123@db:5432/identity" \
  bhargav1848/identity:migrate
```

**Docker Architecture:**
- **Multi-stage build** - Optimized production image (Node 20 Alpine)
- **Separate migration image** - Lightweight image for running migrations (`Dockerfile.migrate`)
- **Health checks** - Database readiness verification via `entrypoint.sh`
- **Volume persistence** - PostgreSQL data persisted in `postgres_data` volume

---

### Option 2: Local Development Setup

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Setup environment variables** (`.env`):
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/identity"
   PORT=3000
   NODE_ENV=development

   # Session Auth
   SESSION_SECRET="your-session-secret"
   SESSION_NAME=sessionId
   SESSION_MAX_AGE=86400000

   # JWT Auth
   JWT_SECRET="your-jwt-secret"

   BCRYPT_ROUNDS=10
   ```

3. **Setup database** (requires PostgreSQL running):
   ```bash
   npm run setup
   ```

   Or use Docker for DB only:
   ```bash
   npm run db:setup
   ```

4. **Run development server**:
   ```bash
   npm run dev
   ```

## Authentication Strategies: Pros & Cons

### Session-Based Auth

**How it works:** Server stores session in database, client sends cookie

**✅ Pros:**
- Server-side logout (instant session revocation)
- Simple to understand and implement
- Good for traditional web apps

**❌ Cons:**
- DB query on every request (1000 req/s = 1000 DB queries/s)
- Hard to scale horizontally (needs sticky sessions or shared store)
- Cookie issues with mobile apps and CORS
- CSRF vulnerability (requires tokens/mitigation)
- Storage overhead (sessions in DB for all active users)

---

### JWT-Based Auth

**How it works:** Server signs token, client stores it, server verifies signature

**✅ Pros:**
- **Stateless** - No DB queries for auth (0 DB queries/s)
- **Scalable** - Any server can verify tokens
- **Mobile/SPA friendly** - Works via Authorization header
- **Microservices ready** - Shared secret validates across services
- **No CSRF** - Tokens not sent automatically
- Built-in expiration (no cleanup jobs)

**❌ Cons:**
- Can't revoke tokens before expiry (need blacklist for logout)
- Slightly larger payload than session cookies
- Token theft risk if not stored securely

---

## When to Use Which?

| Use Case | Recommended |
|----------|-------------|
| Monolithic web app, low traffic | **Session** |
| Need instant logout/revocation | **Session** |
| High scalability needs | **JWT** |
| Mobile app support | **JWT** |
| Microservices architecture | **JWT** |
| Cross-domain APIs | **JWT** |

---

## Critical Implementation Notes

### Session Auth
- Uses PostgreSQL session store (`connect-pg-simple`)
- Session expires after 24h (`SESSION_MAX_AGE`)
- `httpOnly` cookies prevent XSS
- `SameSite: lax` mitigates CSRF

### JWT Auth
- Token expires after 1h (`expiresIn: "1h"`)
- Supports both **cookie** and **Authorization header** (for Postman/mobile)
- Cookie config: `httpOnly`, `secure` (production), `sameSite: lax`
- **Important:** Change `JWT_SECRET` in production!

---

## Security Checklist

**Both strategies:**
- ✅ Bcrypt password hashing
- ✅ httpOnly cookies (XSS protection)
- ✅ Input validation
- ❌ No rate limiting (add in production)
- ❌ No refresh tokens (JWT needs this for logout)

## License

ISC
