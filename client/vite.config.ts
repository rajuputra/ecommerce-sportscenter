import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  server: {
    port: 3000,
    proxy: { "/api": process.env.SPORTSCENTER_API_TARGET ?? "http://127.0.0.1:8081" },
  },
  plugins: [react()],
});
