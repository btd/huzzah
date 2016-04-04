var stringify = require('../safe-json-stringify');
var isoFormat = require('../strftime').isoFormat;

var stringEscapes = {
  '\\': '\\',
  "\"": "\"",
  '\n': 'n',
  '\r': 'r',
  '\t': 't',
  '\u2028': 'u2028',
  '\u2029': 'u2029'
};

/* Used to match unescaped characters in compiled string literals */
var reUnescapedString = /["\n\r\t\u2028\u2029\\]/g;

function escapeStringChar(match) {
  return '\\' + stringEscapes[match];
}

function quote(text) {
  return simpleQuote(text.replace(reUnescapedString, escapeStringChar));
}

function simpleQuote(text) {
  return '"' + text + '"';
}

module.exports = function(rec, __ser) {
  var msg = '';

  msg += "{";
  msg += '"name":' + simpleQuote(rec.name);
  msg += ",";
  msg += '"level":' + rec.level;
  msg += ",";
  msg += '"levelname":' + simpleQuote(rec.levelname);
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
  msg += "}";
  return msg;
};
