const merge = require("webpack-merge");
const webpack = require("webpack");
const common = require("./webpack.common.js");

module.exports = merge(common, {
  output: {
    publicPath: "/"
  },
  devServer: {
    contentBase: "dist",
    hot: true,
    open: true,
    port: 3001,
    clientLogLevel: "info", //none | error | warning | info
    host: "0.0.0.0",
    headers: {
      "x-custom-name": "json"
    },
    proxy: {
      "/api": {
        target: "http://haibo.online:3007/",
        pathRewrite: { "^/api": "" }
      }
    }
  },
  devtool: "inline-source-map",
  mode: "development",
  plugins: [
    new webpack.NamedModulesPlugin(),
    new webpack.HotModuleReplacementPlugin()
  ]
});
