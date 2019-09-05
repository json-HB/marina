const less = require("gulp-less");
const gulp = require("gulp");
const cssnano = require("gulp-cssnano");
const imagemin = require("gulp-imagemin");

gulp.task("imagemin", function(done) {
  gulp
    .src("src/image/*.png")

    .pipe(
      imagemin([
        // imagemin.gifsicle({ interlaced: true, optimizationLevel: 4 }),
        // imagemin.jpegtran({ progressive: true }),
        imagemin.optipng({ optimizationLevel: 5 })
        // imagemin.svgo({
        //   plugins: [{ removeViewBox: true }, { cleanupIDs: false }]
        // })
      ])
    )
    .pipe(gulp.dest("src/image"))
    .on("finish", function() {
      done();
    });
});

gulp.task("default", function(cb) {
  return gulp
    .src("./src/css/bootstrap.less", { base: "src/css" })
    .pipe(less())
    .pipe(cssnano())
    .pipe(gulp.dest("src/css/main"))
    .on("finish", function() {
      cb();
    });
});
