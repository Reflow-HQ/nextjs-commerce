/** @type {import('next').NextConfig} */

module.exports = {
  eslint: {
    // Disabling on production builds because we're running checks on PRs via GitHub Actions.
    ignoreDuringBuilds: true
  },
  experimental: {
    serverActions: true
  },
  images: {
    // Images are loaded from CDN, no need for further nextjs optimization 
    unoptimized: true,
  },
  async redirects() {
    return [{
      source: '/password',
      destination: '/',
      permanent: true
    }];
  }
};