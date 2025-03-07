import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  base: "https://duc-cnzj.github.io/avatar-editor/",
  plugins: [react(), tailwindcss()],
});
