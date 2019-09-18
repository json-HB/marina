const workbox = require("workbox-build");
const gulp = require("gulp");
const del = require("del");
const { CONFIG } = require("./config.js");

const CDN = CONFIG.publicPath;

const dist = CONFIG.dist || "dist";

gulp.task("sw", cb => {
  workbox
    .generateSW({
      cacheId: "gulp-pwa", // 设置前缀
      globDirectory: dist, //匹配根目录
      globPatterns: ["**/*.{html,js,css,png,jpg}"], // 匹配的文件
      globIgnores: ["sw.js", "index.html"], // 忽略的文件
      swDest: `./${dist}/sw.js`, // 输出 Service worker 文件
      clientsClaim: true, // Service Worker 被激活后使其立即获得页面控制权
      skipWaiting: true, // 强制等待中的 Service Worker 被激活
      importWorkboxFrom: "local",
      runtimeCaching: [
        // 配置路由请求缓存 对应 workbox.routing.registerRoute
        {
          urlPattern: /jquery\.js/,
          handler: "cacheFirst"
        },
        {
          urlPattern: /bootstrap\.css$/,
          handler: "cacheFirst"
        },
        {
          urlPattern: /.*\.js/, // 匹配文件
          handler: "networkFirst" // 网络优先
        },
        {
          urlPattern: /.*\.css/,
          handler: "staleWhileRevalidate", // 缓存优先同时后台更新
          options: {
            // 这里可以设置 cacheName 和添加插件
            plugins: [
              {
                cacheableResponse: {
                  statuses: [0, 200]
                }
              }
            ]
          }
        },
        {
          urlPattern: /.*\.(?:png|jpg|jpeg|svg|gif)/,
          handler: "cacheFirst", // 缓存优先
          options: {
            cacheName: "jason-image",
            plugins: [
              {
                expiration: {
                  maxAgeSeconds: 24 * 60 * 60, // 最长缓存时间,
                  maxEntries: 50 // 最大缓存图片数量
                }
              }
            ]
          }
        },
        {
          urlPattern: /.*\.html/,
          handler: "networkFirst"
        }
      ]
    })
    .then(() => {
      console.info("Service worker generation completed.");
      cb();
    })
    .catch(error => {
      console.warn("Service worker generation failed: " + error);
    });
});

gulp.task("delworkboxRest", function(cb) {
  // importScripts("workbox-v4.3.1/workbox-sw.js");
  const version = require(process.cwd() + "/package.json").devDependencies[
    "workbox-build"
  ].replace(/\^?/, "");
  const dir = `workbox-v${version}`;
  const rest = `${dir}/workbox-sw.js`;
  del.sync([
    `dist/${dir}/*.*`,
    `!dist/${rest}`,
    `!dist/${dir}/workbox-core.dev.js`
  ]);
  cb();
});
