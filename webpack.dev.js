const merge = require("webpack-merge");
const webpack = require("webpack");
const common = require("./webpack.common.js");
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer")
  .BundleAnalyzerPlugin;

module.exports = new Promise(function(resolve) {
  const devConfig = merge(common, {
    output: {
      publicPath: "/"
    },
    devServer: {
      contentBase: "dist",
      hot: true,
      open: true,
      port: process.env.port || 3008,
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
  if (process.env.analyzer) {
    devConfig.plugins.push(
      new BundleAnalyzerPlugin({
        analyzerMode: "server",
        openAnalyzer: true,
        analyzerPort: 3100
      })
    );
  }
  resolve(devConfig);
});
