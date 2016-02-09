var quote = require('./quote');
var compileMessage = require('./message');
require('should');

var EOL = '\n';

var rec = {
  level: 30,
  levelname: 'INFO',
  name: 'logger_name',
  pid: 123,
  message: "text message",
  err: new Error('boom'),
  timestamp: new Date('2016-01-29T09:04:19.720Z'),
  context: {
    a: 10,
    b: 'abc'
  }
};



var testCases = [
  ['test', 'test'],

  ['%c', rec.name],
  ['%lo', rec.name],
  ['%logger', rec.name],

  ['%p', rec.levelname],
  ['%le', rec.levelname],
  ['%level', rec.levelname],

  ['%pid', rec.pid],

  ['%m', rec.message],
  ['%msg', rec.message],
  ['%message', rec.message],

  ['%err', rec.err.stack.split('\n').map(function(line) { return '  ' + line; }).join('\n') + '\n'],
  ['%error', rec.err.stack.split('\n').map(function(line) { return '  ' + line; }).join('\n') + '\n'],

  // XXX it is env specific, find better way
  //['%d', '2016/01/29 12:04:19,720'],
  //['%date', '2016/01/29 12:04:19,720'],

  ['%d{%Y}', '2016'],
  ['%date{%Y}', '2016'],

  ['%x', '{"a":10,"b":"abc"}'],
  ['%x{b}', '"abc"'],

  ['%n', EOL],

  ['[%20.20logger]', '[         logger_name]'],
  ['[%-20.20logger]', '[logger_name         ]'],

  ['[%10.10logger]', '[ogger_name]'],
  ['[%10.-10logger]', '[logger_nam]'],

  [' %logger %msg ', ' logger_name text message ']
];


describe('Patter Layout', function() {
  testCases.forEach(function(testCase) {
    it('should match ' + quote(testCase[0]) + ' to ' + quote(String(testCase[1])), function() {
      compileMessage(testCase[0])(rec).should.be.equal(String(testCase[1]));
    });
  });

  it('should throw when used not variable that does not exist', function() {
    (function() {
      compileMessage('%e');
    }).should.throw();
  });
});
