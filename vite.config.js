import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // When running under `vercel dev`, VERCEL=1 is set and requests to /api/proxy/*
    // are handled by the serverless function — no proxy needed.
    // When running `npm run dev` directly, proxy forwards to the API without M2M token
    // (works because NODE_ENV != production on the API side).
    proxy: process.env.VERCEL
      ? undefined
      : {
          "/api/proxy": {
            target: process.env.VITE_API_URL || "http://localhost:5000",
            changeOrigin: true,
            rewrite: (path) => path.replace(/^\/api\/proxy/, "/api"),
          },
        },
  },
})
