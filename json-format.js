var EOL = require('os').EOL;

module.exports = function(serializers) {
  return function(record) {
    return JSON.stringify(record, function(key, value) {
      // exit for whole object
      if(!key) return value;
      // exit for not root properties
      if(record[key] !== value) return value;

      //do not include arguments
      if(key === 'args') return undefined;

      //process with serializers
      if((key in serializers) && value != null) {
        return serializers[key](value);
      }

      //everything else returned as is
      return value;
    }) + EOL;
  }
}
