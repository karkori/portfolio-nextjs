/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: 'mostapha.dev',
          },
        ],
        destination: 'https://www.mostapha.dev/:path*',
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
