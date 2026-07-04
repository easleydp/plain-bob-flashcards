import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig({
  base: "/plain-bob-flashcards/",
  plugins: [
    vue(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon.svg", "icons.svg"],
      manifest: {
        name: "Plain Bob Flashcards",
        short_name: "Plain Bob",
        description:
          "Memorise the details of Plain Bob with Plain Bob Flashcards.",
        theme_color: "#6750A4",
        icons: [
          {
            src: "favicon.svg",
            sizes: "192x192",
            type: "image/svg+xml",
          },
          {
            src: "favicon.svg",
            sizes: "512x512",
            type: "image/svg+xml",
          },
        ],
      },
    }),
  ],
});
