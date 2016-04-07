var jsonCompile = require('./json');

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
  },
  v: 0
};

describe('JSON Format', function() {

  it('should be possible to replace any context variable', function() {
    JSON.parse(jsonCompile(rec, { context: { a: function() { return { level: 'super' }; }} })).should.be.eql({
      context: { "a": { level: "super" }, b: 'abc' },
      level: 30,
      err: {
        message: rec.err.message,
        name: rec.err.name,
        stack: rec.err.stack
      },
      levelname: 'INFO',
      message: 'text message',
      name: 'logger_name',
      pid: 123,
      timestamp: '2016-01-29T09:04:19.720Z',
      v: 0
    });
  });
});
