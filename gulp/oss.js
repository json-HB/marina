const fs = require("fs");
const path = require("path");
const gulp = require("gulp");
const chalk = require("chalk");
const through = require("through2");
const mime = require("mime");
const oss = require("ali-oss");

mime.default_type = "text/plain";

const conf = JSON.parse(
  fs.readFileSync(path.resolve(process.cwd(), "config.json"))
);

console.log(chalk.green(`${JSON.stringify(conf, null, 2)}`));

const { accessKeyId, accessKeySecret, bucket, endpoint } = conf[
  process.env.NODE_ENV || "master"
];

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
              next();
            })
            .catch(err => {
              if (err) {
                failList.push(uploadPath);
                count++;
              }
              next();
            });
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

gulp.task("oss", ["deploy-oss"], done => {
  done();
  console.log(chalk.blue("deploy success!"));
});
