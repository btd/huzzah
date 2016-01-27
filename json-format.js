var EOL = require('os').EOL;
var compile = require('./utils/json/compiler');

module.exports = function(serializers) {
  var f = compile(serializers || {});
  return function(record) {
    return f(record) + EOL;
  };
};
