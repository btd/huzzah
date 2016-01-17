var util = require('util');

var formatRegExp = /%[sdj%]/g;
var inspectOptions = { depth: null, colors: false };
// copy of node.js format function
function format(args) {
  var f = args[0];
  if (typeof f !== 'string') {
    var objects = [];
    for (var i = 0; i < args.length; i++) {
      objects.push(util.inspect(args[i], inspectOptions));
    }
    return objects.join(' ');
  }

  if (args.length === 1) return f;

  var i = 1;
  var len = args.length;
  var str = String(f).replace(formatRegExp, function(x) {
    if (x === '%%') return '%';
    if (i >= len) return x;
    switch (x) {
      case '%s': return String(args[i++]);
      case '%d': return Number(args[i++]);
      case '%j':
        try {
          return JSON.stringify(args[i++]);
        } catch (_) {
          return '[Circular]';
        }
        // falls through
      default:
        return x;
    }
  });
  for (var x = args[i]; i < len; x = args[++i]) {
    if (x === null || (typeof x !== 'object' && typeof x !== 'symbol')) {
      str += ' ' + x;
    } else {
      str += ' ' + inspect(x, inspectOptions);
    }
  }
  return str;
};

module.exports = format;
