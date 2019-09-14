const ArgCONFIG = require("yargs").argv;
const path = require("path");

let CONFIG;
try {
  CONFIG = require(path.resolve("./conig.json"))[
    process.env.branch || "master"
  ];
} catch (e) {
  CONFIG = require(path.resolve("..", "config/marinaConfig.json"))[
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
