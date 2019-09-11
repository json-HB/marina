const less = require("gulp-less");
const gulp = require("gulp");
const cssnano = require("gulp-cssnano");
const imagemin = require("gulp-imagemin");
const through = require("through2");
const fs = require("fs");
const util = require("gulp-util");
const bs = require("browser-sync").create();
const runSequence = require("run-sequence");
let CONFIG = require("yargs").argv;

CONFIG = Object.assign(CONFIG, process.env);

// image type
const PNG = imagemin.optipng({ optimizationLevel: 5 });
const JPEG = imagemin.jpegtran({ progressive: true });
const GIF = imagemin.gifsicle({ interlaced: true, optimizationLevel: 4 });
const SVG = imagemin.svgo({
  plugins: [{ removeViewBox: true }, { cleanupIDs: false }]
});

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
    .src("./src/vendor/bootstrap.less", { base: "src/vendor" })
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
gulp.task("build", function() {
  runSequence("g:webpack:build");
});

// start project
gulp.task("dev", function() {
  runSequence("bootstrap", "g:webpack:dev");
});

// webpack build
gulp.task("g:webpack:build", function() {
  const webpack = require("child_process").exec("npm run  webpack:build", {
    encoding: "utf8",
    cwd: process.cwd()
  });
  webpack.stdout.on("data", d => {
    util.log(String(d));
  });
  webpack.on("close", code => {
    if (code != 0) {
      util.log(util.colors.red(`webpack process exit, code is ${code}`));
    }
  });
});

// webpack dev server
gulp.task("g:webpack:dev", function() {
  const webpack = require("child_process").exec("npm run webpack:dev", {
    encoding: "utf8",
    cwd: process.cwd()
  });
  webpack.stdout.on("data", d => {
    util.log(util.colors.green(String(d)));
  });
  webpack.on("close", code => {
    if (code != 0) {
      util.log(util.colors.red(`webpack process exit, code is ${code}`));
    }
  });
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
