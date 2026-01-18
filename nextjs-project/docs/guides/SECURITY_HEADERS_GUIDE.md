# Security Headers Configuration Guide

## Overview

This document explains the security headers implemented in `next.config.js` to protect the website and users.

---

## Implemented Security Headers

### 1. X-Frame-Options: DENY
**Purpose:** Prevents clickjacking attacks

**What it does:**
- Prevents the website from being embedded in `<iframe>`, `<frame>`, or `<object>` tags
- Protects users from being tricked into clicking on hidden elements

**Value:** `DENY`
- The page cannot be displayed in a frame, regardless of the site attempting to do so

---

### 2. X-Content-Type-Options: nosniff
**Purpose:** Prevents MIME type sniffing

**What it does:**
- Forces browsers to respect the declared Content-Type
- Prevents browsers from interpreting files as a different MIME type than declared

**Value:** `nosniff`
- Blocks requests if the requested type doesn't match the MIME type

**Example Protection:**
- Prevents a malicious user from uploading a file disguised as an image but containing JavaScript

---

### 3. Referrer-Policy: origin-when-cross-origin
**Purpose:** Controls referrer information sent with requests

**What it does:**
- Manages what information is sent in the Referer header
- Protects user privacy while maintaining analytics functionality

**Value:** `origin-when-cross-origin`
- Same-origin requests: Send full URL
- Cross-origin requests: Send only the origin (https://momaiagent.com)

---

### 4. X-XSS-Protection: 1; mode=block
**Purpose:** Enables browser's built-in XSS filter

**What it does:**
- Activates the browser's cross-site scripting (XSS) filter
- Blocks the page if an XSS attack is detected

**Value:** `1; mode=block`
- `1`: Enable XSS filtering
- `mode=block`: Block the page entirely rather than sanitizing

**Note:** Modern browsers rely more on CSP, but this provides defense-in-depth

---

### 5. Strict-Transport-Security (HSTS)
**Purpose:** Enforces HTTPS connections

**What it does:**
- Tells browsers to only connect via HTTPS
- Prevents protocol downgrade attacks
- Protects against cookie hijacking

**Value:** `max-age=63072000; includeSubDomains; preload`
- `max-age=63072000`: 2 years (730 days)
- `includeSubDomains`: Apply to all subdomains
- `preload`: Eligible for browser HSTS preload lists

**Important:**
- Only works when site is accessed via HTTPS
- Vercel automatically provides HTTPS
- Be careful with `preload` - it's hard to undo!

---

### 6. Permissions-Policy
**Purpose:** Controls browser features and APIs

**What it does:**
- Restricts access to sensitive browser features
- Prevents unauthorized use of camera, microphone, etc.

**Value:** `camera=(), microphone=(), geolocation=(), interest-cohort=()`
- `camera=()`: Disable camera access
- `microphone=()`: Disable microphone access
- `geolocation=()`: Disable geolocation
- `interest-cohort=()`: Disable FLoC (Google's tracking alternative)

**Why these restrictions?**
- We don't need these features for a health information website
- Reduces privacy concerns
- Prevents potential exploitation

---

### 7. Content-Security-Policy (CSP)
**Purpose:** The most powerful security header - prevents XSS and data injection attacks

**What it does:**
- Controls which resources can be loaded and executed
- Prevents inline scripts (unless explicitly allowed)
- Restricts where resources can be loaded from

**Detailed Breakdown:**

#### `default-src 'self'`
- Default policy: Only load resources from the same origin
- Fallback for any directive not explicitly set

#### `script-src 'self' 'unsafe-eval' 'unsafe-inline' https://vercel.live https://*.vercel-insights.com`
- `'self'`: Allow scripts from same origin
- `'unsafe-eval'`: Allow `eval()` - needed for some frameworks (use cautiously!)
- `'unsafe-inline'`: Allow inline `<script>` tags - needed for Next.js
- `https://vercel.live`: Vercel's live editing features
- `https://*.vercel-insights.com`: Vercel Analytics

**Security Note:**
- `'unsafe-inline'` and `'unsafe-eval'` reduce CSP effectiveness
- Consider implementing nonces or hashes in production for better security
- Trade-off: convenience vs. maximum security

#### `style-src 'self' 'unsafe-inline' https://fonts.googleapis.com`
- Allow styles from same origin
- Allow inline styles (needed for styled-components, Tailwind, etc.)
- Allow Google Fonts

#### `font-src 'self' https://fonts.gstatic.com data:`
- Allow fonts from same origin
- Allow Google Fonts CDN
- Allow data URIs (base64 encoded fonts)

#### `img-src 'self' data: https: blob:`
- Allow images from same origin
- Allow data URIs (base64 images)
- Allow all HTTPS images (for user-generated content, CDNs, etc.)
- Allow blob URLs (for dynamically generated images)

#### `connect-src 'self' https://api.openai.com https://*.supabase.co https://*.vercel-insights.com`
- Allow AJAX/fetch requests to:
  - Same origin
  - OpenAI API (for AI assistant)
  - Supabase (database)
  - Vercel Analytics

**Important:** Add any other APIs you use here!

#### `frame-ancestors 'none'`
- Same as X-Frame-Options: DENY
- Prevents the page from being framed
- CSP version (more modern)

#### `base-uri 'self'`
- Restricts URLs that can be used in `<base>` element
- Prevents base tag injection attacks

#### `form-action 'self'`
- Restricts where forms can submit data
- Prevents forms from submitting to external sites
- Protects against form hijacking

---

## How to Test Security Headers

### 1. Online Testing Tools

**Security Headers:**
- https://securityheaders.com
- Enter your URL after deployment
- Aim for an A or A+ rating

**Mozilla Observatory:**
- https://observatory.mozilla.org
- Comprehensive security scan
- Provides detailed recommendations

**CSP Evaluator:**
- https://csp-evaluator.withgoogle.com
- Specifically tests Content Security Policy
- Identifies potential bypasses

### 2. Browser DevTools

**Chrome/Edge:**
1. Open DevTools (F12)
2. Go to Network tab
3. Click on any request
4. Check "Headers" section → "Response Headers"

**Firefox:**
1. Open DevTools (F12)
2. Network tab → Click request
3. Headers → Response Headers

### 3. Command Line Test

```bash
curl -I https://your-domain.com
```

Look for the security headers in the response.

---

## Common Issues & Solutions

### Issue 1: CSP Blocking Legitimate Resources

**Symptoms:**
- Images/scripts not loading
- Console errors: "Refused to load..."

**Solution:**
- Check browser console for CSP violations
- Add the blocked domain to appropriate CSP directive

**Example:**
```javascript
// If blocking analytics from example.com
"script-src 'self' https://example.com"
```

### Issue 2: Framer Motion or Animations Not Working

**Symptoms:**
- Animations broken
- Console: "Refused to evaluate a string as JavaScript"

**Cause:**
- Some libraries use `eval()` or inline scripts

**Solution:**
- Already handled with `'unsafe-eval'` and `'unsafe-inline'`
- If still broken, check specific library requirements

### Issue 3: HSTS Too Aggressive

**Symptoms:**
- Can't access site via HTTP during development
- Browser forces HTTPS

**Solution:**
- HSTS only applies after first HTTPS visit
- Clear browser HSTS cache:
  - Chrome: `chrome://net-internals/#hsts`
  - Firefox: Clear site data
- In development, comment out HSTS header

### Issue 4: Third-Party Services Blocked

**Symptoms:**
- Newsletter signup, payment processors, etc. not working

**Solution:**
- Add their domains to CSP:

```javascript
"connect-src 'self' https://api.stripe.com https://api.mailchimp.com"
```

---

## Updating CSP for New Services

When you add new external services, update CSP:

### Adding Google Analytics
```javascript
"script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com",
"connect-src 'self' https://www.google-analytics.com",
"img-src 'self' data: https: https://www.google-analytics.com",
```

### Adding Stripe Payment
```javascript
"script-src 'self' https://js.stripe.com",
"frame-src 'self' https://js.stripe.com",
"connect-src 'self' https://api.stripe.com",
```

### Adding External Image CDN
```javascript
"img-src 'self' data: https://cdn.example.com",
```

---

## Security Best Practices

### 1. Minimize `unsafe-inline` and `unsafe-eval`
- Use nonces or hashes instead when possible
- Next.js 13+ supports nonces natively

### 2. Be Specific with Domains
- Instead of `https://*`, list specific domains
- Reduces attack surface

### 3. Monitor CSP Violations
- Set up CSP reporting endpoint:
```javascript
"report-uri https://your-domain.com/api/csp-report"
```

### 4. Test After Every Update
- Security headers can break functionality
- Test thoroughly after changes

### 5. Review Regularly
- Update CSP when adding new features
- Remove unused permissions
- Check for new security header recommendations

---

## Additional Security Measures

These are implemented separately from headers:

### 1. Environment Variables
- ✅ API keys stored in `.env.local`
- ✅ Never committed to git
- ✅ Set in Vercel dashboard

### 2. Input Validation
- ✅ Validate all user input
- ✅ Sanitize before processing
- ✅ Use parameterized queries (Supabase handles this)

### 3. Rate Limiting
- ⚠️ TODO: Implement on API routes
- Prevents abuse and DoS attacks
- Recommended: Vercel Edge Middleware + Upstash

### 4. HTTPS Everywhere
- ✅ Enforced by Vercel
- ✅ HSTS header ensures browsers use HTTPS

### 5. Dependency Updates
- Regular `npm audit` checks
- Update dependencies for security patches
- Use Dependabot or Renovate

---

## Resources

**Official Docs:**
- [OWASP Secure Headers](https://owasp.org/www-project-secure-headers/)
- [MDN CSP Guide](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP)
- [Next.js Security](https://nextjs.org/docs/advanced-features/security-headers)

**Tools:**
- [Security Headers Checker](https://securityheaders.com)
- [Mozilla Observatory](https://observatory.mozilla.org)
- [CSP Evaluator](https://csp-evaluator.withgoogle.com)

**Learning:**
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Web Security Academy](https://portswigger.net/web-security)

---

**Last Updated:** January 2025
**Review Schedule:** Quarterly or when adding new features
