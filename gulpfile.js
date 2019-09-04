var less = require("gulp-less");
var gulp = require("gulp");
var cssnano = require("gulp-cssnano");

gulp.task("default", function() {
  return gulp
    .src("./src/css/bootstrap.less", { base: "src/css" })
    .pipe(less())
    .pipe(cssnano())
    .pipe(gulp.dest("src/css/main"));
});
