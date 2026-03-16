const createNextIntlPlugin = require("next-intl/plugin");

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');
/** @type {import('next').NextConfig} */

const nextConfig = {
  turbopack: {
    resolveAlias: {
      'next-intl/config': './src/i18n/request.ts',
    },
  },
  images: {
    remotePatterns: [],
  },
  headers: async () => [
    {
      source: "/(.*)",
      headers: [
        {
          key: "Cache-Control",
          value: "public, max-age=31536000, immutable",
        },
      ],
    },
  ],
  output: "standalone",
  poweredByHeader: false,
};

module.exports = withNextIntl(nextConfig);
