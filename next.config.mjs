/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: { unoptimized: true },
  env: {
    // 关键：将 GitHub Secrets 里的变量暴露给前端代码
    NEXT_PUBLIC_GROQ_API_KEY: process.env.GROQ_API_KEY,
  },
};

export default nextConfig;
