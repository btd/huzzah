var EOL = require('os').EOL;

var compileTimestamp = require('./strftime').formatter;

var spacePadding = new Array(1000).join(' ');

function pad(str, value) {
  var isRight = false;

  if(value < 0) {
    isRight = true;
    value = -value;
  }

  if(str.length < value) {
    var padding = spacePadding.slice(0, value - str.length);
    return isRight ? str + padding : padding + str;
  } else{
    return str;
  }
}

function trunc(str, value) {
  if(value > 0) {// truncate from begining
    return str.substring(value - 1);
  } else {// truncate from end
    return str.substring(0, -value);
  }
}

var stringEscapes = {
  '\\': '\\',
  "'": "'",
  '\n': 'n',
  '\r': 'r',
  '\t': 't',
  '\u2028': 'u2028',
  '\u2029': 'u2029'
};

/* Used to match unescaped characters in compiled string literals */
var reUnescapedString = /['\n\r\t\u2028\u2029\\]/g;

function escapeStringChar(match) {
  return '\\' + stringEscapes[match];
}

var MAX_TRACE_LENGTH = 1e10;

function formatError(err, depth) {
  switch(depth){
    case 'full':
      depth = MAX_TRACE_LENGTH;
      break;

    case 'short':
      depth = 1;
      break;

    default:
      if(typeof(depth) !== 'number') {
        depth = MAX_TRACE_LENGTH;
      }
  }
  var trace = err.stack.substr(err.stack.indexOf('\n') + 1).split('\n');
  var out = '  ' + err.name + ': ' + err.message + EOL;

  for(var i = 0, len = Math.min(trace.length, depth); i < len; i++) {
    out += trace[i] + EOL;
  }
  return out;
}

var RE = /%(-?\d+)?(\.-?\d+)?([a-zA-Z\-\\/:]+|%)(?:{([a-zA-Z0-9 ,:\-/\\%]+)})?/g;

var formatCache = {};

module.exports = function(text, _defaultDateFormat) {
  if(formatCache[text]) {
    return formatCache[text];
  }

  var defaultDateFormat = _defaultDateFormat || '%Y/%m/%d %H:%M:%S,%L';

  // assume that original record it is variable rec
  var source = "__p += '",
    index = 0,
    dateFormats = [],
    argumentKeys = ['trunc', 'pad', 'formatError'],
    argumentValues = [trunc, pad, formatError];

  /*jshint maxcomplexity: 25*/
  text.replace(RE, function(match, pad, trunc, name, args, offset) {
    // escape characters that cannot be included in string literals
    source += text.slice(index, offset)
      .replace(reUnescapedString, escapeStringChar);

    var replaceVal = '';
    switch(name) {
    case '%':
      replaceVal = "'%'";
      break;

    case 'c':
    case 'lo':
    case 'logger':
      replaceVal = "rec.name";
      break;

    case 'p':
    case 'le':
    case 'level':
      replaceVal = "rec.levelname";
      break;

    case 'd':
    case 'date':
      var _name = 'dateFormat' + dateFormats.length;
      argumentKeys.push(_name);
      dateFormats.push(compileTimestamp(args || defaultDateFormat));
      replaceVal =  "__" + _name + "(rec.timestamp)";
      break;

    case 'pid':
      replaceVal = "rec.pid";
      break;

    case 'i':
      replaceVal = "rec.i";
      break;

    case 'm':
    case 'msg':
    case 'message':
      replaceVal = "rec.message";
      break;

    case 'n':
      replaceVal = "'" + EOL
        .replace(reUnescapedString, escapeStringChar) + "'";
      break;

    case 'err':
    case 'error':
      replaceVal = '(rec.err ? __formatError(rec.err, "' + args + '"): "")';
      break;

    case 'X':
      break; //TODO mdc context value

    default:
      replaceVal = "''";
    }

    replaceVal = trunc ? '__trunc(' + replaceVal + ',' + trunc + ')'
      : replaceVal;

    replaceVal = pad ? '__pad(' + replaceVal + ',' + pad + ')'
      : replaceVal;

    source += "' +\n" + replaceVal + " +\n'";

    index = offset + match.length;

    return match;
  });

  source += text.substr(index).replace(reUnescapedString, escapeStringChar) + "';\n";

  // frame code as the function body
  source = 'function(rec) {\n' +
    "var " + argumentKeys.map(function(a) {
      return '__' + a + ' = ' + a;
    }).join(', ') + ", __p = '';\n" +
    source +
    'return __p;\n}';
  var result;
  try {
    /*jshint evil: true*/
    result = Function(argumentKeys, 'return ' + source )
      .apply(undefined, argumentValues.concat(dateFormats));
  } catch(e) {
    e.source = source;
    throw e;
  }

  result.source = source;

  formatCache[text] = result;
  return result;
};
