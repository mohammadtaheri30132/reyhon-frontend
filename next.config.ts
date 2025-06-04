/** @type {import('next').NextConfig} */
const nextConfig = {
  // غیرفعال کردن بررسی ESLint در زمان بیلد
  eslint: {
    ignoreDuringBuilds: true,
  },

  // غیرفعال کردن بررسی TypeScript در زمان بیلد
  typescript: {
    ignoreBuildErrors: true,
  },

  // غیرفعال کردن هشدارهای Webpack
  webpack: (config) => {
    config.ignoreWarnings = [/./]; // نادیده گرفتن همه‌ی هشدارها
    return config;
  },
};

module.exports = nextConfig;
