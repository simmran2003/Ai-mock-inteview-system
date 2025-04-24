/** @type {import('next').NextConfig} */
const nextConfig = {
    async redirects() {
        return [
          {
            source: '/',
            destination: '/dashboard',
            permanent: true, // This makes it a 301 redirect
          },
        ];
      },
};

export default nextConfig;
