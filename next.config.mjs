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
                        value: process.env.NODE_ENV === 'production' 
                            ? 'SameSite=Lax; Secure; Path=/' 
                            : 'SameSite=Lax; Path=/'
                    }
                ],
            },
        ];
    },

    // Keep redirects simple
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