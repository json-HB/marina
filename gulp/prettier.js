const gulp = require("gulp");
const prettier = require("prettier-eslint");
const through = require("through2");
const util = require("gulp-util");
const stripJsonComments = require("strip-json-comments");
const fs = require("fs");
const path = require("path");

const ESLINT_RC_FILE = ".eslintrc.json";
const PRETTIER_RC_FILE = ".prettierrc.json";

const safeRequireJson = function(path) {
  if (!fs.existsSync(path)) {
    return null;
  }
  return JSON.parse(stripJsonComments(fs.readFileSync(path).toString()));
};

gulp.task("prettier", function(cb) {
  console.time("prettier");
  gulp
    .src(["src/**/*.+(js|jsx|ts)", "!src/vendor/*.js"])
    .pipe(
      through.obj(function(file, enc, next) {
        util.log(
          util.colors.green(
            `prettier filePath ${path.relative("./", file.path)}`
          )
        );
        const contents = prettier({
          text: file.contents.toString(),
          eslintConfig: safeRequireJson(ESLINT_RC_FILE),
          prettierOptions: safeRequireJson(PRETTIER_RC_FILE)
        });
        file.contents = Buffer.from(contents);
        this.push(file);
        next();
      })
    )
    .pipe(gulp.dest("src"))
    .on("finish", function() {
      util.log(util.colors.bgBlack("finish!"));
      console.timeEnd("prettier");
      cb();
    });
});
