import svelte from "rollup-plugin-svelte"
import commonjs from "@rollup/plugin-commonjs"
import { terser } from "rollup-plugin-terser"
import bundleSize from "rollup-plugin-bundle-size"
import typescript from "rollup-plugin-typescript2"
import pkg from "./package.json"
import nodePolyfills from "rollup-plugin-node-polyfills"
import alias from "@rollup/plugin-alias"
import babel from "@rollup/plugin-babel"
import { typescript as preprocessTypescript } from "svelte-preprocess"

const production = !process.env.ROLLUP_WATCH
const name = pkg.name
  .replace(/^(@\S+\/)?(svelte-)?(\S+)/, "$3")
  .replace(/^\w/, (m) => m.toUpperCase())
  .replace(/-\w/g, (m) => m[1].toUpperCase())

export default {
  input: "src/index.ts",
  output: [
    {
      file: pkg.module, sourcemap: true, format: "es", inlineDynamicImports: true,
    },
    {
      file: pkg.main, sourcemap: true, format: "umd", name, inlineDynamicImports: true,
    },
  ],
  plugins: [
    svelte({
      emitCss: false,
      preprocess: [
        preprocessTypescript({
          handleMixedImports: false,
        }),
      ],
    }),
    typescript(),
    // nodePolyfills(),
    commonjs(),
    production && terser(),
    production && bundleSize(),
  ],
  external: {},
  globals: {},
}
