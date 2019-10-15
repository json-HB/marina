const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const webpack = require("webpack");
const marked = require("marked");
const renderer = new marked.Renderer();

console.log(process.env.dist);

const CONFIG = {
  entry: {
    index: path.join(__dirname, "/src/root/index.js"),
    fqa: path.join(__dirname, "/src/root/fqa.js"),
    "privacy-policy": path.join(__dirname, "/src/root/privacy-policy.js"),
    team: path.join(__dirname, "/src/root/team.js")
  },
  output: {
    filename: "[name].[hash:5].js",
    path: path.resolve(__dirname, process.env.dist || "dist")
  },
  optimization: {
    splitChunks: {
      chunks: "all",
      minSize: 10000,
      minChunks: 1,
      maxAsyncRequests: 5,
      maxInitialRequests: 3,
      automaticNameDelimiter: "-",
      name: true,
      cacheGroups: {
        vendors: {
          chunks: "async",
          test: /[\\/]node_modules[\\/]/,
          priority: 20,
          name: "vendors"
        },
        default: {
          minChunks: 10,
          priority: 10,
          name: "default",
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
      static: path.resolve(__dirname, "./src/static"),
      css: path.resolve(__dirname, "./src/css/main")
    }
  },
  externals: {
    jquery: "jQuery"
  },
  module: {
    rules: [
      {
        test: new RegExp(`\.(c|le)ss$`),
        use: [
          {
            loader: "style-loader"
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
      },
      {
        test: /\.md$/,
        use: [
          {
            loader: "html-loader"
          },
          {
            loader: "markdown-loader",
            options: {
              pedantic: true,
              renderer
            }
          }
        ]
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
    ])
  ]
};

const makePlugins = configs => {
  // 基础插件
  const plugins = configs.plugins;
  const chunksArr = {
    fqa: ["fqa"],
    index: ["index", "vendors", "default"],
    "privacy-policy": ["privacy-policy"],
    team: ["team"]
  };

  // 根据 entry 自动生成 HtmlWebpackPlugin 配置，配置多页面
  Object.keys(configs.entry).forEach(item => {
    plugins.push(
      new HtmlWebpackPlugin({
        title: "KreditOne",
        filename: `${item}.html`,
        template: path.resolve(__dirname, `src/template/${item}.html`),
        minify: {
          removeComments: true,
          collapseWhitespace: true,
          collapseBooleanAttributes: true,
          collapseInlineTagWhitespace: true,
          conservativeCollapse: true,
          minifyJS: {
            compress: true
          },
          minifyCSS: true
        },
        chunks: chunksArr[item]
      })
    );
  });
  return plugins;
};

CONFIG.plugins.concat(makePlugins(CONFIG));

module.exports = CONFIG;
