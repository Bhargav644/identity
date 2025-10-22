const cookieConfig = {
    httpOnly: true,                      // XSS/Cross site scripting protection - can't access in client-side JS
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',                     // CSRF/(Cross-Site Request Forgery) protection
    maxAge: parseInt(process.env.SESSION_MAX_AGE) || 24 * 60 * 60 * 1000,  // 1 day
}

module.exports = cookieConfig;