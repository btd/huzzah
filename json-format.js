var isoFormat = require("./utils/strftime").isoFormat;
var stringify = require("./utils/safe-json-stringify");

var LEVELS = require("./levels");

var LEVELS_QUOTED = {};
Object.keys(LEVELS).forEach(function(level) {
  LEVELS_QUOTED[level] = JSON.stringify(level);
});

var JSON_VERSION = "0";

var NAMES_QUOTTED_CACHE = {};

function jsonFormat(rec, __ser, opts) {
  if (!(rec.name in NAMES_QUOTTED_CACHE)) {
    NAMES_QUOTTED_CACHE[rec.name] = opts.stringify(rec.name);
  }

  var msg =
    "{" +
    '"name":' +
    NAMES_QUOTTED_CACHE[rec.name] +
    ',"level":' +
    String(rec.level) +
    ',"levelname":' +
    LEVELS_QUOTED[rec.levelname] +
    ',"pid":' +
    String(rec.pid) +
    ',"message":' +
    opts.stringify(rec.message) +
    ',"' +
    opts.timestampKeyName +
    '":' +
    String(__ser.timestamp(rec.timestamp)) +
    ',"v":' +
    JSON_VERSION;

  if (rec.err != null) {
    msg +=
      "," +
      '"err":' +
      "{" +
      '"name":' +
      opts.stringify(rec.err.name) +
      "," +
      '"message":' +
      opts.stringify(rec.err.message) +
      "," +
      '"stack":' +
      opts.stringify(rec.err.stack) +
      "}";
  }

  if (rec.context != null) {
    msg += ',"context":{';

    var ctx = [];
    for (var name in rec.context) {
      var value = rec.context[name];
      if (value === undefined) continue;
      if (__ser.context != null && name in __ser.context) {
        var res = __ser.context[name](value);
        if (res === undefined) continue;
        ctx.push(opts.stringify(name) + ":" + opts.stringify(res));
      } else {
        ctx.push(opts.stringify(name) + ":" + opts.stringify(value));
      }
    }
    msg += ctx.join(",");
    msg += "}";
  }

  msg += "}";
  return msg;
}

module.exports = function createJsonFormat(serializers, opts) {
  var o = opts || {};
  o.stringify = o.stringify === "safe" ? stringify : JSON.stringify;
  o.eol = o.eol == null ? "\n" : o.eol;

  var s = serializers || {};
  s.timestamp =
    s.timestamp ||
    function(t) {
      return o.stringify(isoFormat(t));
    };

  o.timestampKeyName = o.timestampKeyName || "timestamp";

  return function(record) {
    return jsonFormat(record, s, o) + o.eol;
  };
};
