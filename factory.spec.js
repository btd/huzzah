/*eslint-env mocha*/
"use strict";

const LoggerFactory = require("./factory");
const should = require("should");
const sinon = require("sinon");

describe("LoggerFactory", function() {
  describe("#settings", function() {
    it("should return settings by logger name", function() {
      const f = new LoggerFactory();
      should.exist(f.settings("abc"));
    });

    it("should return the same settings for the same name", function() {
      const f = new LoggerFactory();

      const s1 = f.settings("abc");
      const s2 = f.settings("abc");
      const s3 = f.settings("a");

      s1.should.equal(s2);
      s1.should.not.be.equal(s3);
    });
  });

  describe("#get", function() {
    it("should return logger by name", function() {
      const f = new LoggerFactory();
      should.exist(f.get("abc"));
    });

    it("should return the same by name", function() {
      const f = new LoggerFactory();

      const s1 = f.get("abc");
      const s2 = f.get("abc");
      const s3 = f.get("a");

      s1.should.equal(s2);
      s1.should.not.be.equal(s3);
    });
  });

  it("bind logger callback to settings handle", function() {
    const f = new LoggerFactory();

    const s = f.settings("a");
    s.handle = sinon.spy();

    const l = f.get("a");

    l.trace();

    s.handle.called.should.be.true();
  });
});
