const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const webpack = require("webpack");

module.exports = {
  entry: {
    app: "./src/index.js"
  },
  output: {
    filename: "[name].[hash:5].js",
    path: path.resolve(__dirname, "dist")
  },
  optimization: {
    splitChunks: {
      chunks: "all",
      minSize: 10000,
      minChunks: 1,
      maxAsyncRequests: 5,
      maxInitialRequests: 3,
      automaticNameDelimiter: "~",
      name: true,
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          priority: 20
        },
        default: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true
        }
      }
    }
  },
  target: "web",
  resolve: {
    extensions: [".js", ".json", ".jsx", ".css"],
    alias: {
      util: path.resolve(__dirname, "./src/util/main.js"),
      ejs: path.resolve(__dirname, "./src/html/ejs"),
      static: path.resolve(__dirname, "./src/static")
    }
  },
  externals: {
    jquery: "jQuery"
  },
  module: {
    rules: [
      {
        test: /\.(c|le)ss$/,
        use: [
          {
            loader: "style-loader" // creates style nodes from JS strings
          },
          {
            loader: "css-loader" // translates CSS into CommonJS
          },
          {
            loader: "postcss-loader",
            options: {
              plugins: [
                require("postcss-plugin-px2rem")({
                  rootValue: 100,
                  unitPrecision: 5,
                  propWhiteList: [],
                  propBlackList: [],
                  exclude: false,
                  selectorBlackList: [],
                  ignoreIdentifier: false,
                  replace: true,
                  mediaQuery: false,
                  minPixelValue: 0
                }),
                require("autoprefixer")(),
                require("cssnano")()
              ]
            }
          },
          {
            loader: "less-loader", // compiles Less to CSS
            options: {
              sourceMap: true
            }
          }
        ]
      },
      {
        test: /\.(png|jpg|jpeg|gif)$/,
        use: [
          {
            loader: "url-loader",
            options: {
              name: "[name]-[hash:5].min.[ext]",
              outputPath: "images/", //输出到 images 文件夹
              limit: 20000 //把小于 20kb 的文件转成 Base64 的格式
            }
          }
        ]
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        use: ["file-loader"]
      },
      {
        test: /\.js$/,
        use: [
          {
            loader: "babel-loader"
          }
        ],
        include: path.resolve(__dirname, "src")
      },
      {
        test: /\.ejs$/,
        loader: "ejs-loader",
        options: {
          variable: "data"
        }
      }
    ]
  },
  plugins: [
    new CopyWebpackPlugin([
      {
        from: "src/css/main/bootstrap.css"
      },
      {
        from: "src/image",
        to: "images"
      },
      {
        from: "src/vendor/jquery.js"
      }
    ]),
    new HtmlWebpackPlugin({
      title: "KreditOne",
      filename: "index.html",
      template: path.resolve(__dirname, "index.html"),
      minify: {
        collapseWhitespace: true,
        removeComments: true,
        collapseBooleanAttributes: true,
        collapseInlineTagWhitespace: true,
        conservativeCollapse: true,
        minifyJS: {
          compress: true
        }
      }
    })
  ]
};
