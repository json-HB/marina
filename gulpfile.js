const less = require("gulp-less");
const gulp = require("gulp");
const cssnano = require("gulp-cssnano");
const imagemin = require("gulp-imagemin");
const through = require("through2");
const fs = require("fs");
const util = require("gulp-util");
const bs = require("browser-sync").create();
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
        util.log(util.colors.bold.green(`file size is ${Size.toFixed(2)} Kb`));
      });
    });
});

// html minify
gulp.task("htmlMini", function(done) {
  gulp
    .src("dist/*.html")
    .pipe(
      through.obj(function(file, enc, next) {
        let res = String(file.contents);
        res = res.replace(/[\n|\t|\s]*/g, "");
        file.contents = Buffer.from(res);
        this.push(file);
        next();
      })
    )
    .pipe(gulp.dest("dist"))
    .on("finish", () => {
      done();
      util.log(util.colors.bold.green("optimize html successful!"));
      if (CONFIG.test == "1") {
        const serverout = require("child_process").spawn("gulp", ["server"]);
        serverout.stdout.on("data", d => {
          util.log(util.colors.green(String(d)));
        });
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
