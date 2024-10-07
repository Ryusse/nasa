import { defineConfig } from "vite";
import { resolve } from "path";
import path from "path";

export default defineConfig({
  root: "./",
  appType: "mpa",
  server: {
    watch: {
      usePolling: true,
    },
    host: true,
  },
  build: {
    minify: true,
    outDir: resolve(__dirname, "dist"),
    emptyOutDir: true,
    rollupOptions: {
      //input: FastGlob.sync(["./src/*.html"]).map((entry) => resolve(__dirname, entry)),
      input: {
        //Html
        index: path.resolve(__dirname, "index.html"),
        missions: path.resolve(__dirname, "missions.html"),
        "predictive-data": path.resolve(__dirname, "predictive-data.html"),
      },

      output: {
        chunkFileNames: "scripts/[name].js",
        entryFileNames: "scripts/[name].js",
        assetFileNames: (assetInfo) => {
          let extType = assetInfo.name.split(".").at(1);
          if (/css$/.test(extType)) {
            extType = "styles";
          } else if (/png$|jpe?g$|svg$|gif$|tiff$|bmp$|ico$/.test(extType)) {
            extType = "images";
          } else if (/ttf$|woff$|woff2$/.test(extType)) {
            extType = "fonts";
          } else {
            extType = "misc";
          }
          return `${extType}/[name][extname]`;
        },
      },
    },
  },
});
