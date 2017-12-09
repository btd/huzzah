"use strict";

const parse = require("./parser");
const compile = require("./compiler");

const formatCache = {};

module.exports = function(text) {
  if (formatCache[text]) {
    return formatCache[text];
  }

  const nodes = parse(text);
  const result = compile(nodes);

  formatCache[text] = result;

  return result;
};
