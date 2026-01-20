import { NextFetchEvent, NextRequest, NextResponse } from 'next/server';

const PUBLIC_FILE = /\.(.*)$/;

export function middleware(request: NextRequest, event: NextFetchEvent) {
    const { pathname } = request.nextUrl;

    // Skip public files and api routes
    if (
        pathname.startsWith('/_next') ||
        pathname.includes('/api/') ||
        PUBLIC_FILE.test(pathname)
    ) {
        return;
    }

    // Handle locale paths ie /en-us/some-slug -> /some-slug (rewrite)
    // This allows the URL to remain /en-us/... but serves the content from root
    // In a real i18n setup you would pass the locale to the page via headers or params
    const localeRegex = /^\/(en-us|en-ca|zh-cn)(\/.*)?$/;
    const match = pathname.match(localeRegex);

    if (match) {
        const locale = match[1];
        const pathAfterLocale = match[2] || '/';

        // We rewrite the URL to the internal path, but we can pass the locale in a header
        // so the page component can theoretically adapt content
        const response = NextResponse.rewrite(new URL(pathAfterLocale, request.url));
        response.headers.set('x-current-locale', locale);
        // Add security headers to rewritten response
        addSecurityHeaders(response);
        return response;
    }

    // AI Bot Detection & Logging
    const userAgent = request.headers.get('user-agent') || '';
    const isAIBot = /GPTBot|ChatGPT-User|Google-Extended|Amazonbot|ClaudeBot|PerplexityBot|Bytespider|CCBot|FacebookBot|anthropic-ai/i.test(userAgent);

    // Check for AI Referrers (indicating citation/usage)
    const referer = request.headers.get('referer') || '';
    const isAIReferrer = /perplexity\.ai|chatgpt\.com|bing\.com\/chat|bard\.google\.com|claude\.ai/i.test(referer);

    if (isAIBot || isAIReferrer) {
        // Use event.waitUntil to process in background without blocking response
        event.waitUntil(
            (async () => {
                try {
                    // Current full URL
                    const url = request.url;

                    // We must use absolute URL for fetch in middleware
                    const apiUrl = new URL('/api/analytics/events', request.url).toString();

                    await fetch(apiUrl, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'x-middleware-auth': 'internal-server-auth' // Simple protection
                        },
                        body: JSON.stringify({
                            event_type: isAIBot ? 'ai_bot_crawl' : 'ai_referral',
                            event_data: {
                                user_agent: userAgent,
                                referer,
                                path: pathname,
                                bot_name: isAIBot ? (userAgent.match(/GPTBot|ChatGPT-User|Google-Extended|Amazonbot|ClaudeBot|PerplexityBot|Bytespider|CCBot|FacebookBot|anthropic-ai/i)?.[0] || 'Unknown AI') : null,
                                referrer_source: isAIReferrer ? new URL(referer).hostname : null
                            }
                        })
                    });
                } catch (err) {
                    console.error('Failed to log AI traffic:', err);
                }
            })()
        );
    }

    // Create response and add security headers
    const response = NextResponse.next();
    addSecurityHeaders(response);
    return response;
}

// Helper function to add security headers (moved from next.config.js to avoid micromatch stack overflow)
function addSecurityHeaders(response: NextResponse) {
    response.headers.set('X-Frame-Options', 'DENY');
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('Referrer-Policy', 'origin-when-cross-origin');
    response.headers.set('X-XSS-Protection', '1; mode=block');
    response.headers.set('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload');
    response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), interest-cohort=()');
    
    // Content Security Policy
    const csp = [
        "default-src 'self'",
        "object-src 'self' data:",
        "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://vercel.live https://*.vercel-insights.com https://va.vercel-scripts.com https://www.googletagmanager.com https://*.google-analytics.com",
        "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
        "font-src 'self' https://fonts.gstatic.com data:",
        "img-src 'self' data: https: blob:",
        "connect-src 'self' https://api.openai.com https://*.supabase.co https://*.vercel-insights.com https://va.vercel-scripts.com https://www.momaiagent.com https://momaiagent.com https://www.google-analytics.com https://*.google-analytics.com",
        "frame-ancestors 'none'",
        "base-uri 'self'",
        "form-action 'self'",
    ].join('; ');
    response.headers.set('Content-Security-Policy', csp);
}

// No matcher config - middleware runs on all routes.
// Internal logic (lines 9-15) filters out static files and API routes.
// This avoids picomatch stack overflow issues during build with 885+ static pages.


