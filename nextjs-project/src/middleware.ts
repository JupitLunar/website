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

    return NextResponse.next();
}

// Use Next.js recommended matcher pattern to avoid picomatch stack overflow
// This excludes static files, _next internals, and favicon
export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - public files with extensions (e.g., .png, .jpg, .svg, etc.)
         */
        '/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)'
    ],
};


