import path from "path"
import { defineConfig } from "vite"
import { svelte } from "@sveltejs/vite-plugin-svelte"

module.exports = defineConfig({
  plugins: [svelte()],
  build: {
    lib: {
      entry: path.resolve(__dirname, "index.ts"),
      name: "@connect2ic/svelte",
      fileName: (format) => `connect2ic-svelte.${format}.js`,
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