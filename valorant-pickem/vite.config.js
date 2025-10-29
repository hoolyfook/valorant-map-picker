import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    host: true, // Cho phép truy cập từ bên ngoài container
    port: 5173, // Giữ nguyên port
    strictPort: true,
    watch: {
      usePolling: true, // Bắt buộc khi chạy trong Docker để HMR hoạt động
    },
  },
});
