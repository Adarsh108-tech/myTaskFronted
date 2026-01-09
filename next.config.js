// next.config.mjs
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["res.cloudinary.com"], // allow Cloudinary
  },
};

export default nextConfig; // <-- use export default instead of module.exports
