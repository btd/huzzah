var stringify = require("./safe-json-stringify");
var util = require("util");

var formatRegExp = /%[sdj%]/g;
var inspectOptions = { depth: null, colors: false };
// copy of node.js format function
function format(args) {
  var f = args[0],
    i;
  if (typeof f !== "string") {
    var objects = [];
    for (i = 0; i < args.length; i++) {
      objects.push(stringify(args[i], inspectOptions));
    }
    return objects.join(" ");
  }

  if (args.length === 1) return f;

  i = 1;
  var len = args.length;
  var str = String(f).replace(formatRegExp, function(x) {
    if (x === "%%") return "%";
    if (i >= len) return x;
    switch (x) {
      case "%s":
        return String(args[i++]);
      case "%d":
        return Number(args[i++]);
      case "%j":
        return stringify(args[i++]);
      // falls through
      default:
        return x;
    }
  });
  for (var x = args[i]; i < len; x = args[++i]) {
    if (x === null || (typeof x !== "object" && typeof x !== "symbol")) {
      str += " " + x;
    } else {
      str += " " + util.inspect(x, inspectOptions);
    }
  }
  return str;
}

module.exports = format;
