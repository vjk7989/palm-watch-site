import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "/palm-watch-site/",
  build: {
    outDir: "dist",
    emptyOutDir: true,
  },
});
