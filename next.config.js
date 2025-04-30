/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ["sqlite3", "bcryptjs"],
  },
};

module.exports = nextConfig;
