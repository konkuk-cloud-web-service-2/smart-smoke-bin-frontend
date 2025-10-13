import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: "export",
  assetPrefix: "./",

  // next/image를 사용한다면 unoptimized 설정도 유지하세요.
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
