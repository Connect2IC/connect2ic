// module.exports = {
//   presets: ["@babel/preset-typescript"],
// }
//
module.exports = {
  presets: ["@babel/preset-typescript", "@babel/preset-react"],
  plugins: ["file-loader"],

  overrides: [
    {
      include: ["./packages/core", "./packages/react"],
      presets: [["@babel/preset-env", { targets: "defaults, not ie 11" }]],
    },
  ],
}