// module.exports = {
//   presets: ["@babel/preset-typescript"],
// }
//
module.exports = {
  presets: ["@babel/preset-typescript", "@babel/preset-react"],
  plugins: [
    ["inline-import-data-uri", {
      "extensions": [".png", ".svg", ".jpg"],
    }],
  ],
  // extensions: [".js", ".mjs", ".svelte", ".html", ".vue", ".ts", ".jsx", ".tsx"],

  overrides: [
    {
      include: ["./packages/core", "./packages/react", "./packages/svelte"],
      presets: [["@babel/preset-env", { targets: "defaults, not ie 11" }]],
    },
  ],
}