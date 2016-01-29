var jsonCompile = require('./json/compiler');

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

describe('JSON Format', function() {
  it('should be possible to skip any defined property', function() {
    JSON.parse(jsonCompile({ level: function() {} })(rec)).should.be.eql({
      context: { a: 10, b: 'abc' },
      err: {
        message: rec.err.message,
        name: rec.err.name,
        stack: rec.err.stack
      },
      levelname: 'INFO',
      message: 'text message',
      name: 'logger_name',
      pid: 123,
      timestamp: '2016-01-29T09:04:19.720Z'
    });
  });

  it('should be possible to replace any defined property with constant', function() {
    JSON.parse(jsonCompile({ level: function() { return 100; } })(rec)).should.be.eql({
      context: { a: 10, b: 'abc' },
      level: 100,
      err: {
        message: rec.err.message,
        name: rec.err.name,
        stack: rec.err.stack
      },
      levelname: 'INFO',
      message: 'text message',
      name: 'logger_name',
      pid: 123,
      timestamp: '2016-01-29T09:04:19.720Z'
    });
  });

  it('should be possible to replace any defined property with other json value', function() {
    JSON.parse(jsonCompile({ level: function() { return { level: 'super' }; } })(rec)).should.be.eql({
      context: { a: 10, b: 'abc' },
      level: {
        level: 'super'
      },
      err: {
        message: rec.err.message,
        name: rec.err.name,
        stack: rec.err.stack
      },
      levelname: 'INFO',
      message: 'text message',
      name: 'logger_name',
      pid: 123,
      timestamp: '2016-01-29T09:04:19.720Z'
    });
  });

  it('should be possible to replace context variable', function() {
    JSON.parse(jsonCompile({ context: function() { return { level: 'super' }; } })(rec)).should.be.eql({
      context: { "level": "super" },
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
      timestamp: '2016-01-29T09:04:19.720Z'
    });
  });

  it('should be possible to replace any context variable', function() {
    JSON.parse(jsonCompile({ context: { a: function() { return { level: 'super' }; }} })(rec)).should.be.eql({
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
      timestamp: '2016-01-29T09:04:19.720Z'
    });
  });
});
