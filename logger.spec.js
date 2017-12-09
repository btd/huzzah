/*eslint-env mocha*/
"use strict";

const should = require("should");
const Logger = require("./logger");
const LEVELS = require("./levels");
const sinon = require("sinon");

describe("Logger", function() {
  describe("#log", function() {
    it("call callback function when call .log with record", function() {
      const spy = sinon.spy();
      const logger = new Logger(spy);

      logger.log(LEVELS.OFF, []);

      spy.called.should.be.true();
      const record = spy.args[0][0];

      should.exist(record);
      record.should.be.an.Object().and.be.not.empty();
    });

    it("call callback function with record containing logger name", function() {
      const logger = new Logger(function(record) {
        record.should.have.property("logger", "logger_name");
      }, "logger_name");

      logger.log(LEVELS.OFF, []);
    });

    it("call callback function with record containing logger context", function() {
      const context = {};
      const logger = new Logger(
        function(record) {
          record.should.have.property("context").which.equal(context);
        },
        "logger_name",
        context
      );

      logger.log(LEVELS.OFF, []);
    });

    it("call callback function with record containing level and levelname passed to .log", function() {
      const logger = new Logger(function(record) {
        record.should.have.property("level").which.equal(LEVELS.TRACE);
        record.should.have.property("levelname").which.equal("TRACE");
      });

      logger.log(LEVELS.TRACE, []);
    });

    it("call callback function with record containing args passed to .log (when no error)", function() {
      const args = [];
      const logger = new Logger(function(record) {
        record.should.have.property("args").which.equal(args);
      });

      logger.log(LEVELS.TRACE, args);
    });

    it("call callback function with record containing args without error and err to be error passed to .log", function() {
      const err = new Error("boom");
      const logger = new Logger(function(record) {
        record.should.have.property("args", ["123"]);
        record.should.have.property("err").which.equal(err);
      });

      logger.log(LEVELS.TRACE, ["123", err]);
    });

    it("call callback function with record containing timestamp", function() {
      const logger = new Logger(function(record) {
        record.should.have.property("timestamp").which.is.Number();
      });

      logger.log(LEVELS.TRACE, []);
    });

    it("call callback function with record containing message", function() {
      const logger = new Logger(function(record) {
        record.should.have.property("message").which.is.String();
      });

      logger.log(LEVELS.TRACE, []);
    });
  });

  describe("log at level methods", function() {
    it("should set record level to TRACE when call #trace", function() {
      const logger = new Logger(function(record) {
        record.should.have.properties({
          level: LEVELS.TRACE,
          levelname: "TRACE"
        });
      });

      logger.trace();
    });

    it("should set record level to DEBUG when call #debug", function() {
      const logger = new Logger(function(record) {
        record.should.have.properties({
          level: LEVELS.DEBUG,
          levelname: "DEBUG"
        });
      });

      logger.debug();
    });

    it("should set record level to INFO when call #info", function() {
      const logger = new Logger(function(record) {
        record.should.have.properties({
          level: LEVELS.INFO,
          levelname: "INFO"
        });
      });

      logger.info();
    });

    it("should set record level to WARN when call #warn", function() {
      const logger = new Logger(function(record) {
        record.should.have.properties({
          level: LEVELS.WARN,
          levelname: "WARN"
        });
      });

      logger.warn();
    });

    it("should set record level to ERROR when call #error", function() {
      const logger = new Logger(function(record) {
        record.should.have.properties({
          level: LEVELS.ERROR,
          levelname: "ERROR"
        });
      });

      logger.error();
    });

    it("should pass all arguments as args of #log", function() {
      const logger = new Logger(function(record) {
        record.args.should.be.eql(["a", 1, 2, 3]);
      });

      logger.error("a", 1, 2, 3);
    });
  });

  describe("#with", function() {
    it("should create new logger with the same name, callback but new context", function() {
      const callback = function() {};
      const name = "123";
      const logger1 = new Logger(callback, name);

      const context = {};
      const logger2 = logger1.with(context);

      logger1._onLogCallback.should.equal(logger2._onLogCallback);
      logger1._name.should.equal(logger2._name);
      logger2._context.should.equal(context);
      logger1.should.not.be.equal(logger2);
    });

    it("should throw if context is not an object", function() {
      const callback = function() {};
      const name = "123";
      const logger1 = new Logger(callback, name);

      (function() {
        logger1.with();
      }.should.throw());
    });
  });
});
