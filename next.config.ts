import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [{ hostname: "cdn.sanity.io" }],
  },
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "3dyvo.com.ua" }],
        destination: "https://www.3dyvo.com.ua/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
