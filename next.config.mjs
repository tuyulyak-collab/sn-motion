/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: [
      "@remotion/bundler",
      "@remotion/renderer",
      "@remotion/cli",
      "@remotion/studio",
      "esbuild",
    ],
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals = [
        ...(config.externals || []),
        "@remotion/bundler",
        "@remotion/renderer",
        "@remotion/cli",
        "@remotion/studio",
        "esbuild",
      ];
    }
    return config;
  },
};

export default nextConfig;
