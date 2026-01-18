import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const PUBLIC_FILE = /\.(.*)$/;

export function middleware(request: NextRequest) {
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

    return NextResponse.next();
}

export const config = {
    matcher: [
        // Match all paths except specific exclusions
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
};
