import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [tailwindcss()],
  server: {
    port: 3000,
    cors: true,
  },
  esbuild: {
    jsx: "automatic",
  },
});
