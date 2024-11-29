/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        // domains: ['i.ibb.co', 'localhost', 'seeking-dev.s3.ap-southeast-1.amazonaws.com'],
        remotePatterns: [
            {
              protocol: 'https',
              hostname: 'i.ibb.co',
              port: '',
              pathname: '**',
              search: '',
            },
          ],
    },
};

export default nextConfig;
