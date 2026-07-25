import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  basePath: process.env.BASE_PATH || "/__mockup",
  turbopack: {
    root: path.join(__dirname, "../.."),
  },
};

export default nextConfig;
