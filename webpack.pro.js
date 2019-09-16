const common = require("./webpack.common.js");
const merge = require("webpack-merge");
const webpack = require("webpack");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

module.exports = merge(common, {
  output: {
    publicPath: process.env.publicPath
  },
  mode: "production",
  plugins: [
    new CleanWebpackPlugin({}),
    new webpack.HashedModuleIdsPlugin({
      hashFunction: "sha256",
      hashDigest: "hex",
      hashDigestLength: 6
    }),
    new webpack.BannerPlugin({
      banner: `Author jihaibo; BuildTime: ${new Date().toUTCString()}`
    })
  ]
});
