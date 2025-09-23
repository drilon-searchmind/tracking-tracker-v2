/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ["lh3.googleusercontent.com"],
    },

    headers: async () => {
        return [
            {
                source: '/(.*)',
                headers: [
                    {
                        key: 'Set-Cookie',
                        value: 'SameSite=Lax; Secure',
                    },
                ],
            },
        ];
    },

    async redirects() {
        return [
            {
                source: '/',
                destination: '/home',
                permanent: false,
            },
            {
                source: '/login',
                has: [
                    {
                        type: 'query',
                        key: 'callbackUrl',
                        value: 'https://(.*)',
                    },
                ],
                destination: '/login?callbackUrl=/home',
                permanent: false,
            },
        ];
    },
};

export default nextConfig;