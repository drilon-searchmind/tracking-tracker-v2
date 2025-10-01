/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: [
            "lh3.googleusercontent.com",
            "attachments.clickup.com"
        ],
    },

    headers: async () => {
        return [
            {
                source: '/(.*)',
                headers: [
                    {
                        key: 'Strict-Transport-Security',
                        value: 'max-age=63072000; includeSubDomains; preload'
                    },
                    {
                        key: 'X-Frame-Options',
                        value: 'DENY'
                    },
                    {
                        key: 'X-Content-Type-Options',
                        value: 'nosniff'
                    }
                ],
            },
            {
                source: '/(.*)\\.(js|mjs)$',
                headers: [
                    {
                        key: 'Content-Type',
                        value: 'application/javascript; charset=utf-8'
                    }
                ],
            }
        ];
    },

    async redirects() {
        return [
            {
                source: '/',
                destination: '/home',
                permanent: false,
            },
        ];
    },
};

export default nextConfig;