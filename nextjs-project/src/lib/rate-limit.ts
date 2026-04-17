import { NextRequest, NextResponse } from 'next/server';
import { getClientIp } from '@/lib/api-auth';

interface RateLimitOptions {
  namespace: string;
  maxRequests: number;
  windowMs: number;
}

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

export interface RateLimitResult {
  allowed: boolean;
  limit: number;
  remaining: number;
  resetAt: number;
  retryAfterSeconds: number;
}

type RateLimitStore = Map<string, Map<string, RateLimitEntry>>;

declare global {
  // eslint-disable-next-line no-var
  var __momAiRateLimitStore__: RateLimitStore | undefined;
}

function getStore() {
  if (!global.__momAiRateLimitStore__) {
    global.__momAiRateLimitStore__ = new Map();
  }

  return global.__momAiRateLimitStore__;
}

function getNamespaceBucket(namespace: string) {
  const store = getStore();
  if (!store.has(namespace)) {
    store.set(namespace, new Map());
  }

  return store.get(namespace)!;
}

export function evaluateRateLimit(request: NextRequest, options: RateLimitOptions): RateLimitResult {
  const now = Date.now();
  const bucket = getNamespaceBucket(options.namespace);
  const key = getClientIp(request);
  const existing = bucket.get(key);

  if (!existing || existing.resetAt <= now) {
    const resetAt = now + options.windowMs;
    bucket.set(key, { count: 1, resetAt });
    return {
      allowed: true,
      limit: options.maxRequests,
      remaining: Math.max(0, options.maxRequests - 1),
      resetAt,
      retryAfterSeconds: Math.ceil(options.windowMs / 1000),
    };
  }

  existing.count += 1;
  bucket.set(key, existing);

  const remaining = Math.max(0, options.maxRequests - existing.count);
  const allowed = existing.count <= options.maxRequests;
  const retryAfterSeconds = Math.max(1, Math.ceil((existing.resetAt - now) / 1000));

  return {
    allowed,
    limit: options.maxRequests,
    remaining,
    resetAt: existing.resetAt,
    retryAfterSeconds,
  };
}

export function attachRateLimitHeaders(response: NextResponse, result: RateLimitResult) {
  response.headers.set('X-RateLimit-Limit', String(result.limit));
  response.headers.set('X-RateLimit-Remaining', String(result.remaining));
  response.headers.set('X-RateLimit-Reset', String(Math.ceil(result.resetAt / 1000)));

  if (!result.allowed) {
    response.headers.set('Retry-After', String(result.retryAfterSeconds));
  }

  return response;
}

export function createRateLimitResponse(result: RateLimitResult, message = 'Too many requests') {
  const response = NextResponse.json(
    {
      error: 'Too many requests',
      message,
    },
    { status: 429 },
  );

  return attachRateLimitHeaders(response, result);
}
