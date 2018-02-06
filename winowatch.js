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
  dforamt = date.toLocaleTimeString("en-us", options);
}

getdate();

module.exports.info = function(msg) {
  getdate();
  console.log(dforamt + "\x1b[36m", "[info]", "\x1b[0m" + "" + msg);

}


module.exports.debug = function(msg) {
  getdate();
  console.log(dforamt + "\x1b[35m", "[debug]", "\x1b[0m" + "" + msg);

}


module.exports.warn = function(msg) {
  getdate();
  console.log(dforamt + "\x1b[33m", "[warn]", "\x1b[0m" + "" + msg);

}


module.exports.error = function(msg) {
  getdate();
  console.log(dforamt + "\x1b[31m", "[error]", "\x1b[0m" + "" + msg);

}
