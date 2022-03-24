import path from "path"
import vue from "@vitejs/plugin-vue"
import { defineConfig } from "vite"

module.exports = defineConfig({
  plugins: [vue()],
  build: {
    lib: {
      entry: path.resolve(__dirname, "index.ts"),
      name: "@connect2ic/vue",
      fileName: (format) => `connect2ic-vue.${format}.js`,
    },
    rollupOptions: {
      // make sure to externalize deps that shouldn't be bundled
      // into your library
      external: ["vue", "react", "svelte"],
      output: {
        // Provide global variables to use in the UMD build
        // for externalized deps
        globals: {
          vue: "Vue",
          react: "React",
        },
      },
    },
  },
})