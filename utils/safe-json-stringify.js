"use strict";

function safeCycles() {
  const seen = [];
  return function(key, val) {
    if (!val || typeof val !== "object") {
      return val;
    }
    if (seen.indexOf(val) !== -1) {
      return "[Circular]";
    }
    seen.push(val);
    return val;
  };
}

function stringify(json) {
  return JSON.stringify(json, safeCycles());
}

module.exports = stringify;
