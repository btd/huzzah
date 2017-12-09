"use strict";

const { isoFormat } = require("./utils/strftime");
const stringify = require("./utils/safe-json-stringify");

const LEVELS = require("./levels");

const LEVELS_QUOTED = {};
Object.keys(LEVELS).forEach(function(level) {
  LEVELS_QUOTED[level] = JSON.stringify(level);
});

const JSON_VERSION = "0";

const NAMES_QUOTTED_CACHE = {};

function jsonFormat(rec, __ser, opts) {
  if (!(rec.logger in NAMES_QUOTTED_CACHE)) {
    NAMES_QUOTTED_CACHE[rec.logger] = opts.stringify(rec.logger);
  }

  let msg =
    "{" +
    '"logger":' +
    NAMES_QUOTTED_CACHE[rec.logger] +
    ',"level":' +
    String(rec.level) +
    ',"levelname":' +
    LEVELS_QUOTED[rec.levelname] +
    ',"message":' +
    opts.stringify(rec.message) +
    ',"' +
    opts.timestampKeyName +
    '":' +
    String(opts.stringify(__ser.timestamp(rec.timestamp))) +
    ',"v":' +
    JSON_VERSION;

  if (rec.err != null) {
    msg +=
      ',"err":{"name":' +
      opts.stringify(rec.err.name) +
      ',"message":' +
      opts.stringify(rec.err.message) +
      ',"stack":' +
      opts.stringify(rec.err.stack) +
      "}";
  }

  if (rec.context != null) {
    msg += ',"context":{';

    const ctx = [];
    for (const name in rec.context) {
      const value = rec.context[name];
      if (value === undefined) continue;
      if (__ser.context != null && name in __ser.context) {
        const res = __ser.context[name](value);
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
  const o = opts || {};
  o.stringify = o.stringify === "safe" ? stringify : JSON.stringify;
  o.eol = o.eol == null ? "\n" : o.eol;

  const s = serializers || {};
  s.timestamp = s.timestamp || isoFormat;

  o.timestampKeyName = o.timestampKeyName || "timestamp";

  return function(record) {
    return jsonFormat(record, s, o) + o.eol;
  };
};
