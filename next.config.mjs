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
};

export default nextConfig;
