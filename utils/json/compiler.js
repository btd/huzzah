var stringify = require('../safe-json-stringify');

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
  context: undefined
};

var RECORD_FIELDS = Object.keys(RECORD_MAPPING)
  .reduce(function(acc, name){
    acc[name] = true;
    return acc;
  }, {});

module.exports = function(serializers) {
  var source = '';
  var argumentKeys = ['res', 'quote', 'stringify', 'ser', 'RECORD_FIELDS'];
  var argumentValues = [null, quote, stringify, serializers, RECORD_FIELDS];

  function writeLine(code) {
    source += '__p += ' + code + ';\n';
  }

  function write(code) {
    source += code;
  }

  writeLine(quote('{'));

  var defaultProperties = [];
  var defaultSerializableProperties = [];

  Object.keys(RECORD_MAPPING).forEach(function(name) {
    if(serializers[name]) {
      defaultSerializableProperties.push([
        '__res = __ser.' + name + '(rec.' + name + ');',
        'if(__res !== undefined) {',
          '__p += "," + ' + quote(quote(name)) + ' + ":" + __stringify(__res);',
        '}'
      ].join('\n'));
      return;
    }

    if(RECORD_MAPPING[name] !== undefined) {
      defaultProperties.push(
        '__p += ' + quote(quote(name)) + ' + ":" + ' + RECORD_MAPPING[name]('rec.' + name) + ';'
      );
    }
  });

  write(defaultProperties.join('\n__p += ",";\n') + '\n');

  if(!serializers.err) {
    write('if(rec.err) {\n__p += "," + ' + quote(quote('err')) + ' + ":" + ' + processError('rec.err') + '\n}\n');
  }

  write(defaultSerializableProperties.join('\n') + '\n');

  write([
    'if(rec.context) {',
      '__p += ",\\\"context\\\":{"',
      '__res = []',
      'for(var name in rec.context) {',
        'var value = rec.context[name];',
        'if(value === undefined) continue;',

        'if(name in __ser) {',
          'var res = __ser[name](value);',
          'if(value === undefined) continue;',

          '__res.push(__quote(name) + ":" + __stringify(res));',
        '} else {',
          '__res.push(__quote(name) + ":" + __stringify(value));',
        '}',
      '}',
      '__p += __res.join(",");',
      '__p += "}"',
    '}'
  ].join('\n'));

  write('\n');

  writeLine(quote('}'));

  source = 'function(rec) {\n' +
    "var " + argumentKeys.map(function(a) { return '__' + a + ' = ' + a; }).join(', ') + ", __p = '';\n" +
    source +
    'return __p;\n}';
  var result;

  try {
    result = Function(argumentKeys, 'return ' + source ).apply(undefined, argumentValues);
  } catch(e) {
    e.source = source;
    throw e;
  }

  result.source = source;

  return result;
};
