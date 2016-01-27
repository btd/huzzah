var should = require('should');
var Logger = require('./logger');
var LEVELS = require('./levels');

describe('Logger', function() {

  it('call callback function when call .log with record', function() {
    var called = false;
    var logger = new Logger(function(record) {
      called = true;

      should.exist(record);
      record.should.be.an.Object().and.be.not.empty();
    });

    logger.log(LEVELS.OFF, []);

    called.should.be.true();
  });

  it('call callback function with record containing logger name', function() {
    var logger = new Logger(function(record) {
      record.should.have.property('name', 'logger_name');
    }, 'logger_name');

    logger.log(LEVELS.OFF, []);
  });

  it('call callback function with record containing logger context', function() {
    var context = {};
    var logger = new Logger(function(record) {
      record.should.have.property('context').which.equal(context);
    }, 'logger_name', context);

    logger.log(LEVELS.OFF, []);
  });

  it('call callback function with record containing level and levelname passed to .log', function() {
    var logger = new Logger(function(record) {
      record.should.have.property('level').which.equal(LEVELS.TRACE);
      record.should.have.property('levelname').which.equal('TRACE');
    });

    logger.log(LEVELS.TRACE, []);
  });

  it('call callback function with record containing args passed to .log (when no error)', function() {
    var args = [];
    var logger = new Logger(function(record) {
      record.should.have.property('args').which.equal(args);
    });

    logger.log(LEVELS.TRACE, args);
  });

  it('call callback function with record containing args without error and err to be error passed to .log', function() {
    var err = new Error('boom');
    var logger = new Logger(function(record) {
      record.should.have.property('args', [ '123' ]);
      record.should.have.property('err').which.equal(err);
    });

    logger.log(LEVELS.TRACE, ['123', err]);
  });

  it('call callback function with record containing timestamp', function() {
    var logger = new Logger(function(record) {
      record.should.have.property('timestamp').which.is.Date();
    });

    logger.log(LEVELS.TRACE, []);
  });
});
