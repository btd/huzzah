"use strict";

const stringEscapes = {
  "\\": "\\",
  "'": "'",
  "\n": "n",
  "\r": "r",
  "\t": "t",
  "\u2028": "u2028",
  "\u2029": "u2029"
};

/* Used to match unescaped characters in compiled string literals */
const reUnescapedString = /['\n\r\t\u2028\u2029\\]/g;

function escapeStringChar(match) {
  return "\\" + stringEscapes[match];
}

module.exports = function quote(text) {
  return "'" + text.replace(reUnescapedString, escapeStringChar) + "'";
};
