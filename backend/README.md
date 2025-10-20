# Identity - Session-Based Authentication Backend

A Node.js/Express backend implementing **server-side session-based authentication** using PostgreSQL for session storage and user management.

## Tech Stack

- **Runtime**: Node.js v24.7.0
- **Framework**: Express.js 5.1.0
- **Database**: PostgreSQL
- **ORM**: Prisma 6.17.1
- **Session Store**: connect-pg-simple (PostgreSQL session storage)
- **Password Hashing**: bcrypt
- **Environment**: dotenv

## Project Structure

```
backend/
├── prisma/
│   └── schema.prisma          # Database schema
├── src/
│   ├── config/
│   │   ├── database.js        # Prisma client configuration
│   │   └── session.js         # Express-session configuration
│   ├── controllers/
│   │   └── authController.js  # Auth request handlers
│   ├── middleware/
│   │   └── authMiddleware.js  # Session authentication middleware
│   ├── routes/
│   │   └── authRoutes.js      # Auth route definitions
│   ├── services/
│   │   └── authService.js     # Business logic for auth
│   ├── utils/
│   │   └── validators.js      # Input validation
│   └── app.js                 # Express app configuration
├── server.js                  # Server entry point
├── .env                       # Environment variables
└── package.json
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

### Public Endpoints
- `POST /auth/register-session` - Register new user
- `POST /auth/login-session` - Login and create session

### Protected Endpoints (Require Session)
- `GET /auth/profile-session` - Get user profile
- `POST /auth/logout-session` - Logout and destroy session

## Setup & Installation

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Setup environment variables** (`.env`):
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/identity"
   PORT=3000
   NODE_ENV=development
   SESSION_SECRET="your-secret-key"
   SESSION_NAME=sessionId
   SESSION_MAX_AGE=86400000
   BCRYPT_ROUNDS=10
   ```

3. **Setup database**:
   ```bash
   npm run setup
   ```

4. **Run development server**:
   ```bash
   npm run dev
   ```

## How Session-Based Auth Works

1. **Registration/Login**: User credentials validated → Session created in PostgreSQL
2. **Session Cookie**: Server sends `sessionId` cookie to client (httpOnly, secure)
3. **Subsequent Requests**: Client sends cookie → Server validates session from DB
4. **Logout**: Session destroyed from database, cookie cleared

## Example Usage

### Register
```bash
curl -X POST http://localhost:3000/auth/register-session \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"SecurePass123","name":"John Doe"}'
```

### Login
```bash
curl -X POST http://localhost:3000/auth/login-session \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"SecurePass123"}' \
  -c cookies.txt
```

### Get Profile (with session)
```bash
curl http://localhost:3000/auth/profile-session \
  -b cookies.txt
```

---

## Why This Approach is Problematic

While session-based authentication works, it has **significant limitations** in modern applications:

### 1. **Scalability Issues**

**Problem**: Every request requires a database lookup to validate the session.

```javascript
// On EVERY protected route request:
const requireAuth = (req, res, next) => {
  // Session middleware queries PostgreSQL to fetch session data
  if (!req.session || !req.session.userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
};
```

**Impact**:
- High database load with thousands of concurrent users
- Increased latency (50-200ms per DB query)
- Difficult to scale horizontally without sticky sessions or shared session storage

### 2. **Horizontal Scaling Complexity**

**Problem**: Sessions are stored server-side, making multi-server deployments complex.

**Example**:
```
User logs in → Server A (creates session in PostgreSQL)
Next request → Server B (must access same PostgreSQL to validate)
```

**Solutions needed**:
- Sticky sessions (load balancer routes user to same server)
- Centralized session store (Redis/PostgreSQL shared across all servers)
- Session replication (complexity + sync issues)

### 3. **Mobile/SPA Unfriendly**

**Problem**: Cookies don't work well with mobile apps and cross-origin requests.

**Issues**:
- Mobile apps (iOS/Android) don't handle cookies naturally
- CORS complications with `credentials: 'include'`
- Cookie storage restrictions on mobile browsers
- No standard way to attach cookies to WebSocket connections

### 4. **CSRF Vulnerability**

**Problem**: Session cookies are automatically sent by browsers, enabling CSRF attacks.

**Attack Example**:
```html
<!-- Attacker's malicious website -->
<img src="https://yourapp.com/auth/logout-session" />
<!-- Browser automatically sends session cookie! -->
```

**Mitigation Required**:
- CSRF tokens on every form/state-changing request
- SameSite cookie attribute (limits cross-site functionality)
- Additional middleware and complexity

### 5. **Memory/Storage Overhead**

**Problem**: Every active session stored in database/memory.

**Example**:
- 100,000 active users = 100,000 database rows
- Session data includes user info, timestamps, metadata (~1-5KB each)
- Total: 100MB - 500MB just for sessions
- Requires periodic cleanup of expired sessions

### 6. **Limited Cross-Domain Support**

**Problem**: Cookies are domain-specific.

**Scenario**:
```
Main app: app.example.com
API: api.example.com
Mobile: mobile.example.com
```

Each subdomain needs careful cookie configuration or won't share sessions.

---

## Why JWT is Better for Modern Apps

### JWT (JSON Web Token) Advantages

#### 1. **Stateless & Scalable**
```javascript
// No database lookup needed!
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.userId = decoded.userId; // Done!
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};
```

**Benefits**:
- Zero database queries for authentication
- Perfect horizontal scaling (any server can validate)
- Lower latency (cryptographic verification is fast)

#### 2. **Mobile & SPA Friendly**
```javascript
// Client (React/Mobile)
localStorage.setItem('token', response.data.token);

// Subsequent requests
fetch('/api/profile', {
  headers: { 'Authorization': `Bearer ${token}` }
});
```

**Benefits**:
- Works identically on web, iOS, Android
- No cookie complexity
- Easy to implement in any client

#### 3. **Microservices Ready**
```javascript
// User Service generates JWT
const token = jwt.sign({ userId, email }, SECRET_KEY);

// Payment Service validates JWT (no shared DB needed)
// Order Service validates JWT (no shared DB needed)
// Notification Service validates JWT (no shared DB needed)
```

#### 4. **No CSRF Vulnerability**
- Tokens stored in localStorage/memory (not cookies)
- Must be explicitly added to requests
- Attackers can't trigger automatic token transmission

#### 5. **Built-in Expiration**
```javascript
const token = jwt.sign(
  { userId: user.id },
  SECRET_KEY,
  { expiresIn: '24h' } // Self-contained expiry
);
```

No cleanup jobs needed - tokens expire automatically.

---

## Real-World Comparison

### Session-Based (Current Implementation)

**Login Request Flow**:
1. Client sends credentials
2. Server validates → **DB Query #1**
3. Server creates session → **DB Write #1**
4. Server sends cookie
5. **Every protected request** → **DB Query** to fetch session

**Cost**: 1 DB query per request × 1000 requests/sec = 1000 DB queries/sec

### JWT-Based (Recommended)

**Login Request Flow**:
1. Client sends credentials
2. Server validates → **DB Query #1** (only this!)
3. Server generates JWT (cryptographic operation, no DB)
4. Client stores token
5. **Every protected request** → Verify signature (no DB!)

**Cost**: 0 DB queries for authentication × 1000 requests/sec = 0 DB queries/sec

---

## Migration Path: Session → JWT

**Recommended Approach**:

1. Add JWT authentication alongside sessions (dual support)
2. Migrate clients gradually to JWT
3. Deprecate session endpoints
4. Remove session infrastructure

**Sample JWT Implementation**:
```javascript
// Login endpoint
const token = jwt.sign(
  { userId: user.id, email: user.email },
  process.env.JWT_SECRET,
  { expiresIn: '7d' }
);

const refreshToken = jwt.sign(
  { userId: user.id },
  process.env.REFRESH_SECRET,
  { expiresIn: '30d' }
);

res.json({ token, refreshToken });
```

---

## When to Use Sessions vs JWT

### Use Sessions When:
- Monolithic application (single server)
- Need server-side logout (instant revocation)
- Low traffic (<1000 concurrent users)
- Web-only application

### Use JWT When:
- Microservices architecture
- High scalability requirements
- Mobile app support
- Cross-domain/CORS scenarios
- Stateless API design

---

## Security Considerations

### Current Implementation
- ✅ Passwords hashed with bcrypt
- ✅ httpOnly cookies (XSS protection)
- ✅ SameSite cookie attribute (CSRF mitigation)
- ❌ No rate limiting
- ❌ No refresh token mechanism
- ❌ Session fixation possible

### JWT Best Practices
- Use short-lived access tokens (15min - 1hr)
- Implement refresh tokens (stored securely)
- Add token blacklist for logout
- Use RS256 for microservices (asymmetric keys)
- Store tokens securely (httpOnly cookies or memory)

---

## Conclusion

This session-based implementation is **functional for learning** but **not production-ready** for modern, scalable applications. For real-world use, consider migrating to JWT-based authentication with refresh tokens.

## License

ISC
