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
const del = require("del");

requireAll({
  dirname: __dirname + "/gulp",
  filter: /(.*)\.js$/,
  recursive: true
});

console.log(CONFIG);

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

// build project
gulp.task("build", ["del", "g:webpack:build"], function(cb) {
  runSequence("srcCDN", "propoMerge", "sw", "pwa", "ga", cb);
});

// start project
gulp.task("dev", function() {
  runSequence("bootstrap", "g:webpack:dev");
});

// webpack build
gulp.task("g:webpack:build", function(cb) {
  const webpack = require("child_process").execSync("npm run webpack:build", {
    encoding: "utf8",
    cwd: process.cwd(),
    env: Object.assign(process.env, { ...CONFIG })
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
gulp.task("server", function(cb) {
  bs.init(
    {
      ui: {
        port: 3010
      },
      server: {
        baseDir: CONFIG.dist
      }
    },
    function() {
      util.log(util.colors.green("server start for test!"));
      cb();
    }
  );
});

// clean dist
gulp.task("del", function(done) {
  del.sync(CONFIG.dist);
  done();
});
