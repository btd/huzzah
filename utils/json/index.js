var stringify = require('../safe-json-stringify');
var isoFormat = require('../strftime').isoFormat;

var ESCAPES = {
  92: "\\\\",
  34: '\\"',
  8: "\\b",
  12: "\\f",
  10: "\\n",
  13: "\\r",
  9: "\\t"
};

function pad2(n) {
  switch(n.length) {
    case 2: return '00';
    case 1: return '0' + n;
    case 0: return '' + n;
  }
}

var UNICODE_PREFIX = "\\u00";

function escapeChar(character) {
  var charCode = character.charCodeAt(0), escaped = ESCAPES[charCode];
  if (escaped) {
    return escaped;
  }
  return UNICODE_PREFIX + pad2(charCode.toString(16));
}

var reEscape = /[\x00-\x1f\x22\x5c]/g;
function quote(value) {
  reEscape.lastIndex = 0;
  return '"' +
    (
      reEscape.test(value)
        ? value.replace(reEscape, escapeChar)
        : value
    ) +
    '"';
}

var JSON_VERSION = 0;

module.exports = function(rec, __ser) {
  var msg = '';

  msg += "{";
  msg += '"name":' + quote(rec.name);
  msg += ",";
  msg += '"level":' + rec.level;
  msg += ",";
  msg += '"levelname":' + quote(rec.levelname);
  msg += ",";
  msg += '"pid":' + rec.pid;
  msg += ",";
  msg += '"message":' + quote(rec.message);

  if (rec.err) {
    msg += "," +
      '"err":' +
        "{" +
          '"name":' + quote(rec.err.name) + "," +
          '"message":' + quote(rec.err.message) + "," +
          '"stack":' + quote(rec.err.stack) +
        "}";
  }
  var t = typeof __ser.timestamp === 'function' ?
      __ser.timestamp(rec.timestamp) :
      isoFormat(rec.timestamp);

  msg += "," + '"timestamp":' + (typeof t === 'string' ? quote(t) : t);

  if (rec.context) {
    msg += ",\"context\":{";

    var ctx = [];
    for (var name in rec.context) {
      var value = rec.context[name];
      if (value === undefined) continue;
      if (__ser.context && name in __ser.context) {
        var res = __ser.context[name](value);
        if (res === undefined) continue;
        ctx.push(quote(name) + ":" + stringify(res));
      } else {
        ctx.push(quote(name) + ":" + stringify(value));
      }
    }
    msg += ctx.join(",");
    msg += "}";
  }
  msg += ',"v":' + JSON_VERSION;
  msg += "}";
  return msg;
};
