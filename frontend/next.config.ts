import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    // Proxy API calls to the gateway in development
    async rewrites() {
        return [
            {
                source: "/api/:path*",
                destination: "http://localhost:5000/api/:path*",
            },
        ];
    },
};

export default nextConfig;
