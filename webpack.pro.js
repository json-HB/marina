const common = require("./webpack.common.js");
const merge = require("webpack-merge");
const webpack = require("webpack");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

module.exports = merge(common, {
  output: {
    publicPath: process.env.publicPath,
    filename: "js/[name].js?v=[chunkhash]",
    hashDigestLength: 6,
    chunkFilename: "js/[name].js?v=[chunkhash]"
  },
  mode: "production",
  optimization: {
    runtimeChunk: {
      name: "manifest"
    }
  },
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
