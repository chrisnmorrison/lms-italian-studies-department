/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true, // Enables SWC-based minification (faster than Terser in Next 13)
 
  webpack(config, { isServer }) {
    // Additional Webpack configurations can go here
    if (!isServer) {
      config.resolve.fallback = {
        fs: false,
        path: false,
      };
    }
    return config;
  },

  async redirects() {
    return [
      {
        source: "/old-route",
        destination: "/new-route",
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
