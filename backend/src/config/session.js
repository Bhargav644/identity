const session = require('express-session');
const pgSession = require('connect-pg-simple')(session);
const { Pool } = require('pg');


// Create a PostgreSQL connection pool which will only manages 
// sessions nothing else so that it doesn't interfere with Prisma's connection pool

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 10,                    // Max connections
  idleTimeoutMillis: 30000,   // Close idle connections after 30s
  connectionTimeoutMillis: 2000,
});


const sessionConfig = session({
  store: new pgSession({
    pool: pool,
    tableName: 'session',
    createTableIfMissing: false,         // We manage tables with Prisma
    pruneSessionInterval: 60,            // Clean expired sessions every 60s
  }),
  /**
   * secret: Used to sign the session ID cookie, ensuring its integrity and security. No body can change signature
   * resave: Prevents saving session if unmodified, reducing unnecessary database writes.
   * saveUninitialized: Avoids storing uninitialized sessions, enhancing privacy and reducing storage.
   */
  name: process.env.SESSION_NAME || 'sessionId',
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,                      // XSS/Cross site scripting protection - can't access in client-side JS
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',                     // CSRF/(Cross-Site Request Forgery) protection
    maxAge: parseInt(process.env.SESSION_MAX_AGE) || 24 * 60 * 60 * 1000,  // 1 day
  },

});

module.exports=sessionConfig