/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'iluhahr.blob.core.windows.net',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'wolfix-api.azurewebsites.net',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

module.exports = nextConfig;