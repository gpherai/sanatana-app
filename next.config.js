/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: false,
  },
  // Allow WSL to Windows connections
  allowedDevOrigins: [
    'localhost:3000',
    '127.0.0.1:3000',
    '172.23.227.40:3000', // WSL IP
    '10.255.255.254:3000', // Network IP
  ],
}

export default nextConfig
