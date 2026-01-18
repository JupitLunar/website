import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: 'Mom AI Agent',
        short_name: 'Mom AI Agent',
        description: 'Evidence-Based Parenting Guide for North America',
        start_url: '/',
        display: 'standalone',
        background_color: '#ffffff',
        theme_color: '#ffffff',
        icons: [
            {
                src: '/Assets/Logo.png',
                sizes: '192x192',
                type: 'image/png',
            },
            {
                src: '/Assets/Logo.png',
                sizes: '512x512',
                type: 'image/png',
            },
        ],
    };
}
