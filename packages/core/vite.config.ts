import path from "path"
import { defineConfig } from "vite"

module.exports = defineConfig({
  build: {
    lib: {
      entry: path.resolve(__dirname, "index.tsx"),
      name: "@connect2ic/core",
      fileName: (format) => `connect2ic-core.${format}.js`,
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