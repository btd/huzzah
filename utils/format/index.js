var parser = require('./message_parser');
var compiler = require('./message_compiler');

var formatCache = {};

module.exports = function(text) {
  if(formatCache[text]) {
    return formatCache[text];
  }

  var nodes = parser.parse(text);
  var result = compiler(nodes);
  formatCache[text] = result;
  return result;
}
