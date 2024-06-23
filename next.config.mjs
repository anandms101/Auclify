/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
      remotePatterns: [
        {
          hostname: "pub-0590923952344a11800d21ad5b1e040b.r2.dev",
          protocol: "https",
          port: "",
        },
      ],
    },
  };
  
  export default nextConfig;