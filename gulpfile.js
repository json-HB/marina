const less = require("gulp-less");
const gulp = require("gulp");
const path = require("path");
const cssnano = require("gulp-cssnano");
const imagemin = require("gulp-imagemin");
const through = require("through2");
const fs = require("fs");
const util = require("gulp-util");
const bs = require("browser-sync").create();
const runSequence = require("run-sequence");
const requireAll = require("require-all");
const { CONFIG } = require("./gulp/config.js");

requireAll({
  dirname: __dirname + "/gulp",
  filter: /(.*)\.js$/,
  recursive: true
});

console.log(CONFIG);

const publicPath = CONFIG.publicPath;

// image type
const PNG = imagemin.optipng({ optimizationLevel: 5 });
const JPEG = imagemin.jpegtran({ progressive: true });
const GIF = imagemin.gifsicle({ interlaced: true, optimizationLevel: 4 });
const SVG = imagemin.svgo({
  plugins: [{ removeViewBox: true }, { cleanupIDs: false }]
});

function outputLog(target) {
  target.stdout.on("data", d => {
    util.log(util.colors.green(String(d)));
  });
  target.stderr.on("data", d => {
    util.log(util.colors.red(String(d)));
  });
  target.on("close", code => {
    if (code != 0) {
      util.log(util.colors.red(`webpack process exit, code is ${code}`));
    }
  });
}

// image minify
gulp.task("imagemin", function(done) {
  gulp
    .src("src/image/*.png")

    .pipe(imagemin([PNG]))
    .pipe(gulp.dest("src/image"))
    .on("finish", function() {
      done();
    });
});

gulp.task("bootstrap", function(cb) {
  gulp
    .src("./src/css/vendor/bootstrap.less", { base: "src/css/vendor" })
    .pipe(less())
    .pipe(cssnano())
    .pipe(gulp.dest("src/css/main"))
    .on("finish", function() {
      cb();
      fs.stat("./src/css/main/bootstrap.css", (err, stat) => {
        if (err) throw new Error("read bootstrap file error");
        const Size = stat.size / 1024;
        util.log(util.colors.bold.green(`file size is ${Size.toFixed(2)} Kb`));
      });
    });
});

// start project
gulp.task("build", ["g:webpack:build"], function(cb) {
  runSequence("srcCDN", "propoMerge", cb);
});

// start project
gulp.task("dev", function() {
  runSequence("bootstrap", "g:webpack:dev");
});

// propertyMerge
gulp.task("propoMerge", function(cb) {
  return gulp
    .src("dist/*.html")
    .pipe(
      through.obj(function(file, obj, done) {
        let content = String(file.contents);
        content = content.replace(/{{([^}]*)}}/g, function(full, $1) {
          return CONFIG[$1] || "failed";
        });
        file.contents = Buffer.from(content);
        this.push(file);
        done();
      })
    )
    .pipe(gulp.dest("dist"));
});

// replace src
gulp.task("srcCDN", function(cb) {
  return gulp
    .src("dist/*.html")
    .pipe(
      through.obj(function(file, obj, done) {
        let content = String(file.contents);
        content = content.replace(/([src|href]=")([^"]*)"/g, function(
          full,
          $1,
          $2
        ) {
          if (/https?|\/\//.test($2) || !$2.startsWith("/")) {
            return full;
          } else {
            return $1 + publicPath + $2 + '"';
          }
        });
        file.contents = Buffer.from(content);
        this.push(file);
        done();
      })
    )
    .pipe(gulp.dest("dist"));
});

// webpack build
gulp.task("g:webpack:build", function(cb) {
  const webpack = require("child_process").execSync("npm run  webpack:build", {
    encoding: "utf8",
    cwd: process.cwd(),
    env: Object.assign(process.env, { publicPath })
  });
  // outputLog(webpack);
  cb();
});

// webpack dev server
gulp.task("g:webpack:dev", function() {
  const webpack = require("child_process").exec("npm run webpack:dev", {
    encoding: "utf8",
    cwd: process.cwd()
  });
  outputLog(webpack);
});

// start local server
gulp.task("server", function() {
  bs.init(
    {
      server: {
        baseDir: "dist"
      }
    },
    function() {
      util.log(util.colors.green("server start for test!"));
    }
  );
});
