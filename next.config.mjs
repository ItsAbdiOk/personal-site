/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // Redirect sources are matched case-insensitively by default, which would make
    // /Zakiya → /zakiya loop forever. There are no other redirects/rewrites/headers.
    caseSensitiveRoutes: true,
  },
  async redirects() {
    return [
      { source: "/Zakiya", destination: "/zakiya", permanent: true },
      { source: "/Zakiya/:path*", destination: "/zakiya/:path*", permanent: true },
    ];
  },
};

export default nextConfig;
