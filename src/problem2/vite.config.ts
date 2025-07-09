import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  base: "/tvlinh-99techteam-code-challenge/problem2/",
  plugins: [react(), tailwindcss()],
  server: {
    port: 3000,
  },
  resolve: {
    alias: {
      "~app": "/src",
    },
  },
});
