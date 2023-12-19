/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['res.cloudinary.com',"images.unsplash.com","localhost", "ppsb.vercel.app", "ppsb.mazainulhasan1.sch.id", "mazainulhasan1.sch.id"],
  },
}

module.exports = nextConfig
