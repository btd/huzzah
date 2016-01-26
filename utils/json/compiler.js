var stringEscapes = {
  '\\': '\\',
  "\"": "\"",
  '\n': 'n',
  '\r': 'r',
  '\t': 't',
  '\u2028': 'u2028',
  '\u2029': 'u2029'
};

/* Used to match unescaped characters in compiled string literals */
var reUnescapedString = /["\n\r\t\u2028\u2029\\]/g;

function escapeStringChar(match) {
  return '\\' + stringEscapes[match];
}

function quote(text) {
  return '"' + text.replace(reUnescapedString, escapeStringChar) + '"';
}

function processString(str) {
  return '__quote(' + str + ')';
}

function processNumber(n) {
  return 'String('+n+')';
}

function processDate(name) {
  return processString(name+'.toJSON()');
}

function safeCycles() {
  var seen = [];
  return function (key, val) {
      if (!val || typeof (val) !== 'object') {
          return val;
      }
      if (seen.indexOf(val) !== -1) {
          return '[Circular]';
      }
      seen.push(val);
      return val;
  };
}

function stringify(json) {
  return JSON.stringify(json, safeCycles());
}

function processError(name) {
  return [
    quote('{'),
    quote(quote('name')),
    quote(':'),
    processString(name + '.name'),
    quote(','),
    quote(quote('message')),
    quote(':'),
    processString(name + '.message'),
    quote(','),
    quote(quote('stack')),
    quote(':'),
    processString(name + '.stack'),
    quote('}')
  ].join(' + ');
}

var RECORD_MAPPING = {
  name: processString,
  level: processNumber,
  levelname: processString,
  args: undefined,
  pid: processNumber,
  timestamp: processDate,
  err: undefined,
  message: processString,
  __hasAdditionalFields: undefined
};

var RECORD_FIELDS = Object.keys(RECORD_MAPPING)
  .reduce(function(acc, name){
    acc[name] = true;
    return acc;
  }, {});

module.exports = function(serializers) {
  var source = '';
  var argumentKeys = ['quote', 'stringify', 'ser', 'RECORD_FIELDS'];
  var argumentValues = [quote, stringify, serializers, RECORD_FIELDS];

  function writeLine(code) {
    source += '__p += ' + code + ';\n';
  }

  function write(code) {
    source += code;
  }

  writeLine(quote('{'));

  var defaultProperties = [];
  var hasStandardPropertySerializer = false;

  Object.keys(RECORD_MAPPING).forEach(function(name) {
    if(serializers[name]) {
      hasStandardPropertySerializer = true;
      return;
    }

    if(RECORD_MAPPING[name] !== undefined) {
      defaultProperties.push(
        '__p += ' +
        quote(quote(name)) +
        ' + ' +
        quote(':') +
        ' + ' +
        RECORD_MAPPING[name]('rec.' + name) +
        ';\n'
      );
    }
  });

  write(defaultProperties.join('__p += ",";\n'));

  if(!serializers.err) {
    write('if(rec.err) {\n__p += "," + ' + processError('rec.err') + '\n}\n');
  }

  write([
    hasStandardPropertySerializer ? '': 'if(rec.__hasAdditionalFields) {',
      'for(var name in rec) {',
        'var value = rec[name];',
        'if(value === undefined) continue;',

        'if(name in __ser) {',
          'var res = __ser[name](value);',
          'if(value === undefined) continue;',

          '__p += "," + __quote(name) + ":" + __stringify(res)',
        '} else if (name in __RECORD_FIELDS) {',
        '} else {',
          '__p += "," + __quote(name) + ":" + __stringify(value);',
        '}',
      '}',
    hasStandardPropertySerializer ? '': '}'
  ].join('\n'));

  write('\n')

  writeLine(quote('}'));

  source = 'function(rec) {\n' +
    "var " + argumentKeys.map(function(a) { return '__' + a + ' = ' + a; }).join(', ') + ", __p = '';\n" +
    source +
    'return __p;\n}';
  var result;

  console.log(source)

  try {
    result = Function(argumentKeys, 'return ' + source ).apply(undefined, argumentValues);
  } catch(e) {
    e.source = source;
    throw e;
  }

  result.source = source;

  return result;
}
