var EOL = '\n';
var f = require('./utils/json/index');

module.exports = function createJsonFormat(serializers) {
  var s = serializers || {};
  return function jsonFormat(record) {
    return f(record, s) + EOL;
  };
};
