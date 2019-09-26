const gulp = require("gulp");
const imagemin = require("gulp-imagemin");
const less = require("gulp-less");
const cssnano = require("gulp-cssnano");
const fs = require("fs");
const util = require("gulp-util");
const through = require("through2");
const { CONFIG } = require("./config.js");
const publicPath = CONFIG.publicPath;
const dist = CONFIG.dist || "dist";

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

// propertyMerge
gulp.task("propoMerge", function(cb) {
  return gulp
    .src(`${dist}/*.html`)
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
    .pipe(gulp.dest(dist));
});

// replace src
gulp.task("srcCDN", function(cb) {
  return gulp
    .src(`${dist}/*.html`)
    .pipe(
      through.obj(function(file, obj, done) {
        let content = String(file.contents);
        content = content.replace(/([src|href]=")([^"]*)"/g, function(
          full,
          $1,
          $2
        ) {
          if (
            /https?|\/\//.test($2) ||
            !$2.startsWith("/") ||
            /\.html[#?]?/.test($2)
          ) {
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
    .pipe(gulp.dest(dist));
});

// pwa task
gulp.task("pwa", function(cb) {
  gulp
    .src(["src/static/pwa/*", "src/static/*.webmanifest"], {
      base: "src/static/"
    })
    .pipe(gulp.dest(dist))
    .on("finish", cb);
});
