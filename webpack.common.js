const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const webpack = require("webpack");
const marked = require("marked");
const renderer = new marked.Renderer();
const fs = require("fs");
const ora = require("ora");

const taskConfig = ora("config init...");
taskConfig.start();

function aliasResove(dir) {
  return path.resolve(__dirname, dir);
}

function getEntries() {
  const files = fs.readdirSync(path.resolve("src/root"), "utf-8");
  const entries = {};
  files.forEach((file, i) => {
    const name = file.replace(/\.js/, "");
    entries[name] = `./src/root/${file}`;
  });
  return entries;
}
console.log(getEntries());
const CONFIG = {
  entry: getEntries(),
  output: {
    filename: "[name].[hash:5].js",
    path: path.resolve(__dirname, process.env.dist || "dist")
  },
  optimization: {
    splitChunks: {
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
          priority: 20
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
      util: aliasResove("./src/util/main.js"),
      ejs: aliasResove("./src/html/ejs"),
      static: aliasResove("./src/static"),
      css: aliasResove("./src/css/main")
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
            loader: "css-loader",
            options: {
              modules: false
            } // translates CSS into CommonJS
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
      },
      {
        from: "src/static/*.mp4",
        to: "video",
        flatten: true
      }
    ]),
    new webpack.NoEmitOnErrorsPlugin()
  ]
};

const makePlugins = configs => {
  // 基础插件
  const plugins = configs.plugins;
  const chunksArr = {
    fqa: ["fqa"],
    index: ["index", "vendors", "default"],
    "privacy-policy": ["privacy-policy"],
    team: ["team"],
    personLoan: ["personLoan"]
  };

  // 根据 entry 自动生成 HtmlWebpackPlugin 配置，配置多页面
  Object.keys(configs.entry).forEach(item => {
    plugins.push(
      new HtmlWebpackPlugin({
        title: "One kredit for all | Kreditone",
        filename: `${item}.html`,
        template: path.resolve(__dirname, `src/template/${item}.html`),
        minify: {
          removeComments: true,
          collapseWhitespace: true,
          collapseBooleanAttributes: true,
          collapseInlineTagWhitespace: true,
          conservativeCollapse: true,
          minifyJS: {
            compress: true,
            warnings: false
          },
          minifyCSS: true
        },
        chunks: chunksArr[item].concat("manifest")
      })
    );
  });
  return plugins;
};

CONFIG.plugins.concat(makePlugins(CONFIG));

taskConfig.succeed("config init successful!");

module.exports = CONFIG;
