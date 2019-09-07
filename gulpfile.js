const less = require("gulp-less");
const gulp = require("gulp");
const cssnano = require("gulp-cssnano");
const imagemin = require("gulp-imagemin");
const fs = require("fs");

const PNG = imagemin.optipng({ optimizationLevel: 5 });
const JPEG = imagemin.jpegtran({ progressive: true });
const GIF = imagemin.gifsicle({ interlaced: true, optimizationLevel: 4 });
const SVG = imagemin.svgo({
  plugins: [{ removeViewBox: true }, { cleanupIDs: false }]
});

gulp.task("imagemin", function(done) {
  gulp
    .src("src/image/*.png")

    .pipe(imagemin([PNG]))
    .pipe(gulp.dest("src/image"))
    .on("finish", function() {
      done();
    });
});

gulp.task("default", function(cb) {
  gulp
    .src("./src/css/bootstrap.less", { base: "src/css" })
    .pipe(less())
    .pipe(cssnano())
    .pipe(gulp.dest("src/css/main"))
    .on("finish", function() {
      cb();
      fs.stat("./src/css/main/bootstrap.css", (err, stat) => {
        if (err) throw new Error("read bootstrap file error");
        const Size = stat.size / 1024;
        console.log(`file size is ${Size.toFixed(2)} Kb`);
      });
    });
});
