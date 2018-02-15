const fs = require("fs");
const configfile = fs.readFileSync("config.json");
const config = JSON.parse(configfile);

function getdate() {
  let date = new Date()
  let options = {
    weekday: "long",
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  };
  return date.toLocaleTimeString("en-us", options);
}

module.exports.info = function(msg) {
  console.log(getdate() + "\x1b[36m", "[info]", "\x1b[0m" + "" + msg);
}

module.exports.debug = function(msg) {
  if (config.debug == true) {
    console.log(getdate() + "\x1b[35m", "[debug]", "\x1b[0m" + "" + msg);
  }
}

module.exports.warn = function(msg) {
  console.log(getdate() + "\x1b[33m", "[warn]", "\x1b[0m" + "" + msg);
}

module.exports.error = function(msg) {
  console.log(getdate() + "\x1b[31m", "[error]", "\x1b[0m" + "" + msg);
}
