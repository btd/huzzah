var parse = require("./parser");
var compile = require("./compiler");

var formatCache = {};

module.exports = function(text) {
  if (formatCache[text]) {
    return formatCache[text];
  }

  var nodes = parse(text);
  var result = compile(nodes);

  formatCache[text] = result;

  return result;
};
