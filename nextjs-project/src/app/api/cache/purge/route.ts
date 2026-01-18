import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath, revalidateTag } from 'next/cache';

/**
 * Cache Purge API Endpoint
 * 
 * This endpoint allows manual cache purging for specific paths or tags.
 * 
 * Usage:
 * - Purge specific path: POST /api/cache/purge?secret=YOUR_SECRET&path=/foods/salmon
 * - Purge by tag: POST /api/cache/purge?secret=YOUR_SECRET&tag=insights
 * - Purge multiple: POST /api/cache/purge?secret=YOUR_SECRET&paths=/foods/egg,/foods/salmon
 * - Purge all foods: POST /api/cache/purge?secret=YOUR_SECRET&tag=foods
 * 
 * Security: Requires REVALIDATION_SECRET environment variable
 */

export async function POST(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const secret = searchParams.get('secret');
    const path = searchParams.get('path');
    const paths = searchParams.get('paths');
    const tag = searchParams.get('tag');
    const tags = searchParams.get('tags');

    // Verify secret
    if (secret !== process.env.REVALIDATION_SECRET) {
        return NextResponse.json(
            { success: false, message: 'Invalid secret' },
            { status: 401 }
        );
    }

    const purgedPaths: string[] = [];
    const purgedTags: string[] = [];

    try {
        // Purge single path
        if (path) {
            revalidatePath(path);
            purgedPaths.push(path);
        }

        // Purge multiple paths
        if (paths) {
            const pathList = paths.split(',').map(p => p.trim());
            for (const p of pathList) {
                revalidatePath(p);
                purgedPaths.push(p);
            }
        }

        // Purge single tag
        if (tag) {
            revalidateTag(tag);
            purgedTags.push(tag);
        }

        // Purge multiple tags
        if (tags) {
            const tagList = tags.split(',').map(t => t.trim());
            for (const t of tagList) {
                revalidateTag(t);
                purgedTags.push(t);
            }
        }

        // If no parameters provided, return error
        if (purgedPaths.length === 0 && purgedTags.length === 0) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'No path or tag specified. Use ?path=/your-path or ?tag=your-tag'
                },
                { status: 400 }
            );
        }

        return NextResponse.json({
            success: true,
            message: 'Cache purged successfully',
            purged: {
                paths: purgedPaths,
                tags: purgedTags,
                timestamp: new Date().toISOString()
            }
        });

    } catch (error) {
        console.error('Cache purge error:', error);
        return NextResponse.json(
            {
                success: false,
                message: 'Failed to purge cache',
                error: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        );
    }
}

// GET method for documentation
export async function GET() {
    return NextResponse.json({
        endpoint: '/api/cache/purge',
        method: 'POST',
        description: 'Manually purge Next.js cache for specific paths or tags',
        parameters: {
            secret: 'Required - REVALIDATION_SECRET from environment',
            path: 'Optional - Single path to purge (e.g., /foods/salmon)',
            paths: 'Optional - Comma-separated paths (e.g., /foods/egg,/foods/salmon)',
            tag: 'Optional - Single tag to purge (e.g., insights)',
            tags: 'Optional - Comma-separated tags (e.g., foods,insights)'
        },
        examples: [
            'POST /api/cache/purge?secret=YOUR_SECRET&path=/foods/salmon',
            'POST /api/cache/purge?secret=YOUR_SECRET&paths=/foods/egg,/foods/salmon',
            'POST /api/cache/purge?secret=YOUR_SECRET&tag=insights',
            'POST /api/cache/purge?secret=YOUR_SECRET&tags=foods,insights'
        ],
        availableTags: [
            'insights - All insight articles',
            'foods - All food pages',
            'topics - All topic pages'
        ]
    });
}
