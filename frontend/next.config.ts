import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    agentFeedback: true,
    // LLM-backed endpoints can be slow; default proxy timeout is 30s.
    proxyTimeout: 120_000,
  },
  rewrites: async () => [
    {
      source: "/api/:path*",
      destination: `${process.env.BACKEND_URL ?? "http://localhost:8000"}/:path*`,
    },
  ],
  cacheComponents: true,
  partialPrefetching: true,
  reactCompiler: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
