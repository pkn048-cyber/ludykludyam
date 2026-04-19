import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  basePath: "/ludykludyam",
  assetPrefix: "/ludykludyam/",
  images: { unoptimized: true },
};

export default nextConfig;
