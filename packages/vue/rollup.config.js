import commonjs from "@rollup/plugin-commonjs"
import { terser } from "rollup-plugin-terser"
import bundleSize from "rollup-plugin-bundle-size"
import typescript from "rollup-plugin-typescript2"
import pkg from "./package.json"
// import vue from "@vitejs/plugin-vue"
import vue from "rollup-plugin-vue"
import resolve from "@rollup/plugin-node-resolve"
import postcss from "rollup-plugin-postcss"
// import nodePolyfills from "rollup-plugin-node-polyfills"

const production = !process.env.ROLLUP_WATCH
const name = pkg.name
  .replace(/^(@\S+\/)?(vue-)?(\S+)/, "$3")
  .replace(/^\w/, (m) => m.toUpperCase())
  .replace(/-\w/g, (m) => m[1].toUpperCase())

export default {
  input: "src/index.ts",
  output: [
    {
      file: pkg.module, sourcemap: true, format: "es", inlineDynamicImports: true,
      // external: ["vue"],
      globals: {
        vue: "Vue",
      },
    },
    {
      file: pkg.main, sourcemap: true, format: "umd", name, inlineDynamicImports: true,
      // external: ["vue"],
      globals: {
        vue: "Vue",
      },
    },
  ],
  plugins: [
    vue(),
    typescript(),
    // resolve(),
    // nodePolyfills(),
    commonjs(),
    postcss(),
    production && terser(),
    production && bundleSize(),
  ],
  external: ["Vue"],
  // globals: {
  //   vue: "Vue",
  // },
}