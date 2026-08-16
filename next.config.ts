import type { NextConfig } from "next";

// GitHub Pages serves this repo at https://<owner>.github.io/Legislative_Log/,
// so production builds need every asset/link prefixed with the repo name.
const repoName = "Legislative_Log";
const isGithubPages = process.env.GITHUB_PAGES === "true";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: "export",
  basePath: isGithubPages ? `/${repoName}` : "",
  assetPrefix: isGithubPages ? `/${repoName}/` : "",
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
