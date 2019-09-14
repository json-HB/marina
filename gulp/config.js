const ArgCONFIG = require("yargs").argv;
const path = require("path");
const fs = require("fs");

let CONFIG;
if (fs.existsSync(path.resolve("./config.json"))) {
  CONFIG = require(path.resolve("./config.json"))[
    process.env.branch || "master"
  ];
} else {
  CONFIG = require(path.resolve("../" + "config/marinaConfig.json"))[
    process.env.branch || "master"
  ];
}

CONFIG = Object.assign(
  CONFIG,
  process.env,
  {
    BUILD_TIME: new Date().toISOString()
  },
  ArgCONFIG
);

Object.keys(CONFIG).forEach(key => {
  key.startsWith("npm_") && Reflect.deleteProperty(CONFIG, key);
});

exports.CONFIG = CONFIG;
