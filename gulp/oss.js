const path = require("path");
const gulp = require("gulp");
const chalk = require("chalk");
const through = require("through2");
const mime = require("mime");
const oss = require("ali-oss");
const { CONFIG } = require("./config.js");
const fs = require("fs");
const runSequnse = require("run-sequence");

mime.default_type = "text/plain";
// deploy cache map
let CACHE;

// has cache list
let HAS_CACHE_LIST = [];

const { accessKeyId, accessKeySecret, bucket, endpoint } = CONFIG;

if (!accessKeyId || !accessKeySecret) {
  throw new Error(
    "deploy-oss: ossAccessKeyId or ossAccessKeySecret undefined!"
  );
}
if (!bucket) {
  throw new Error("deploy-oss: bucket undefined!");
}
if (!endpoint) {
  throw new Error("deploy-oss: endpoint undefined!");
}

const client = new oss({
  accessKeyId,
  accessKeySecret,
  bucket,
  endpoint
});

function deployOss(opt, done) {
  let failList = [];
  let retryTimes = 0;
  (function deploy() {
    const src = (failList.length > 0 && failList) || opt.src;
    failList = [];
    let count = 0;
    gulp
      .src(src, { base: "dist" })
      .pipe(
        through.obj((file, enc, next) => {
          if (!file.isBuffer()) {
            next();
            return;
          }
          const uploadPath = path
            .relative(file.base, file.path)
            .replace(/^\.?\/?/, "");
          const content = String(file.contents);
          const degest = require("crypto")
            .createHash("md5")
            .update(content)
            .digest("hex")
            .slice(0, 8);
          if (CACHE[uploadPath] && CACHE[uploadPath] == degest) {
            HAS_CACHE_LIST.push(uploadPath);
          } else {
            CACHE[uploadPath] = `${degest}`;
            client
              .put(uploadPath, file.contents, {
                mime: mime.getType(uploadPath),
                headers: {
                  "Cache-Control": "public",
                  Expires: 3600
                }
              })
              .then(() => {
                console.log(chalk.green(uploadPath));
              })
              .catch(err => {
                if (err) {
                  failList.push(uploadPath);
                  count++;
                }
              });
          }
          next();
        })
      )
      .on("finish", () => {
        if (failList.length) {
          console.log(
            chalk.red(`Deploy oss failed: ${count} files`),
            `\n${failList.join("\n")}`
          );
          // retry 3 times at most
          if (retryTimes < 3) {
            retryTimes++;
            console.log(chalk.red(`Retry deploy oss time ${retryTimes}...`));
            deploy();
          } else {
            console.log(chalk.red("Deploy oss failed!"));
            done();
          }
        } else {
          console.log("AllCacheFile:");
          console.log(chalk.yellow(JSON.stringify(CACHE, null, 2)));
          console.log("FromCacheFile:");
          console.log(chalk.blue(JSON.stringify(HAS_CACHE_LIST, null, 2)));
          fs.writeFileSync(
            process.cwd() + "/.cacheFile",
            JSON.stringify(CACHE, null, 2)
          );
          console.log(chalk.blue("deploy success!"));
          done();
        }
      })
      .on("error", err => {
        done(err);
      });
  })();
}

gulp.task("deploy-oss", done => {
  deployOss(
    {
      src: ["dist/**/*", "!dist/**/*.html"]
    },
    done
  );
});

gulp.task("oss", done => {
  runSequnse("cache", "deploy-oss", done);
});

gulp.task("cache", function(cb) {
  const cachePath = path.resolve(".cacheFile");
  if (!fs.existsSync(cachePath)) {
    fs.writeFileSync(cachePath, "{}");
  }
  try {
    CACHE = JSON.parse(fs.readFileSync(path.resolve(".cacheFile"), "utf-8"));
  } catch (e) {
    CACHE = {};
  }
  cb();
  // gulp
  //   .src(["dist/**/*"], { base: "dist" })
  //   .pipe(
  //     through.obj(function(file, enc, next) {
  //       const content = String(file.contents);
  //       const degest = require("crypto")
  //         .createHash("md5")
  //         .update(content)
  //         .digest("hex")
  //         .slice(0, 8);
  //       const pathname = path.relative(file.base, file.path);
  //       CACHE[pathname] = `${degest}`;
  //       this.push(file);
  //       next();
  //     })
  //   )
  //   .pipe(gulp.dest("dist"))
  //   .on("finish", function() {
  //     console.log(CACHE);
  //     fs.writeFileSync(cachePath, JSON.stringify(CACHE, null, 2), "utf-8");
  //     cb();
  //   });
});
