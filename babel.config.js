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

  overrides: [
    {
      include: ["./packages/core", "./packages/react"],
      presets: [["@babel/preset-env", { targets: "defaults, not ie 11" }]],
    },
  ],
}