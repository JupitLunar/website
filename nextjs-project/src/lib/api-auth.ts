import { createHash, timingSafeEqual } from 'crypto';
import { NextRequest, NextResponse } from 'next/server';

interface RequireApiSecretOptions {
  secretNames: string[];
  context?: string;
  allowQueryParam?: string;
}

function secureCompare(candidate: string, expected: string) {
  const candidateBuffer = Buffer.from(candidate);
  const expectedBuffer = Buffer.from(expected);

  if (candidateBuffer.length !== expectedBuffer.length) {
    return false;
  }

  return timingSafeEqual(candidateBuffer, expectedBuffer);
}

function resolveConfiguredSecrets(secretNames: string[]) {
  return secretNames
    .map((name) => process.env[name])
    .filter((value): value is string => Boolean(value));
}

function readBearerToken(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return null;
  }

  return authHeader.slice(7).trim() || null;
}

function readHeaderTokens(request: NextRequest) {
  const headerNames = ['x-api-key', 'x-internal-api-secret', 'x-cron-secret'];
  return headerNames
    .map((header) => request.headers.get(header)?.trim())
    .filter((value): value is string => Boolean(value));
}

function readQueryToken(request: NextRequest, allowQueryParam?: string) {
  if (!allowQueryParam) {
    return null;
  }

  const value = request.nextUrl.searchParams.get(allowQueryParam)?.trim();
  return value || null;
}

export function hasValidApiSecret(
  request: NextRequest,
  secretNames: string[],
  allowQueryParam?: string,
) {
  const configuredSecrets = resolveConfiguredSecrets(secretNames);
  if (configuredSecrets.length === 0) {
    return false;
  }

  const tokens = [
    readBearerToken(request),
    ...readHeaderTokens(request),
    readQueryToken(request, allowQueryParam),
  ].filter((value): value is string => Boolean(value));

  if (tokens.length === 0) {
    return false;
  }

  return tokens.some((token) => configuredSecrets.some((secret) => secureCompare(token, secret)));
}

export function requireApiSecret(
  request: NextRequest,
  { secretNames, context = 'internal api', allowQueryParam }: RequireApiSecretOptions,
) {
  if (hasValidApiSecret(request, secretNames, allowQueryParam)) {
    return null;
  }

  return NextResponse.json(
    {
      error: 'Unauthorized',
      message: `A valid secret is required to access this ${context}.`,
    },
    { status: 401 },
  );
}

export function getClientIp(request: NextRequest) {
  const forwardedFor = request.headers.get('x-forwarded-for');
  if (forwardedFor) {
    const firstIp = forwardedFor.split(',')[0]?.trim();
    if (firstIp) {
      return firstIp;
    }
  }

  const realIp = request.headers.get('x-real-ip')?.trim();
  if (realIp) {
    return realIp;
  }

  return request.ip || 'unknown';
}

export function hashValue(value: string) {
  return createHash('sha256').update(value).digest('hex');
}
