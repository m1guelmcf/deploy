/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["axios", "uuid", "some-esm-lib"],
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
}

export default nextConfig
