const merge = require("webpack-merge");
const webpack = require("webpack");
const common = require("./webpack.common.js");

module.exports = merge(common, {
  devServer: {
    contentBase: "dist",
    hot: true,
    open: true
  },
  devtool: "inline-source-map",
  mode: "development",
  plugins: [
    new webpack.HashedModuleIdsPlugin(),
    new webpack.HotModuleReplacementPlugin()
  ]
});
