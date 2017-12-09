/*eslint-env mocha*/
"use strict";

const handlers = require("./handlers");
const LEVELS = require("./levels");

const sinon = require("sinon");

require("should");

describe("NullHandler", function() {
  describe("#setLevel", function() {
    it("should have by default level ALL", function() {
      const h = new handlers.NullHandler();

      h._level.should.be.equal(LEVELS.ALL);
    });

    it("should accept level priority", function() {
      const h = new handlers.NullHandler();
      h.setLevel(LEVELS.INFO);

      h._level.should.be.equal(LEVELS.INFO);
    });

    it("should accept string version of level", function() {
      const h = new handlers.NullHandler();
      h.setLevel("INFO");

      h._level.should.be.equal(LEVELS.INFO);
    });

    it("should throw if it is not number", function() {
      const h = new handlers.NullHandler();

      (function() {
        h.setLevel({});
      }.should.throw());
    });

    it("should throw if such level/priority does not exist", function() {
      const h = new handlers.NullHandler();

      (function() {
        h.setLevel("FATAL");
      }.should.throw());
    });
  });

  describe("#handle", function() {
    it("should call _handle if record level have the same or more priority", function() {
      const h = new handlers.NullHandler();

      let called = false;
      h._handle = function(r) {
        called = true;
        r.test.should.be.equal("a");
      };

      h.handle({ level: LEVELS.INFO, test: "a" });

      called.should.be.true();
    });

    it("should not call _handle if record level have lower priority", function() {
      const h = new handlers.NullHandler();
      h.setLevel(LEVELS.INFO);

      let called = false;
      h._handle = function() {
        called = true;
      };

      h.handle({ level: LEVELS.TRACE, test: "a" });

      called.should.be.false();
    });
  });
});

describe("BaseHandler", function() {
  it("should have some default format", function() {
    const h = new handlers.BaseHandler();
    h.should.have.property("formatRecord").which.is.Function();
  });

  describe("#setFormat", function() {
    it("should compile format if passed string", function() {
      const h = new handlers.BaseHandler();
      const f = h.formatRecord;
      h.setFormat("test");
      h.should.have.property("formatRecord").which.is.not.equal(f);
    });

    it("should set format function if passed function", function() {
      const h = new handlers.BaseHandler();
      const f = h.formatRecord;
      const ff = function() {};
      h.setFormat(ff);
      h.should.have
        .property("formatRecord")
        .which.is.not.equal(f)
        .and.equal(ff);
    });

    it("should throw if passed not string and not function", function() {
      const h = new handlers.BaseHandler();
      (function() {
        h.setFormat(10);
      }.should.throw());
    });
  });
});

describe("ConsoleHandler", function() {
  let origStdout;
  let origStderr;

  beforeEach(function() {
    origStdout = process.stdout.write;
    origStderr = process.stderr.write;
  });

  it("should pass record to stdout if level <= INFO", function() {
    let called = false;
    process.stdout.write = function() {
      called = true;
    };

    process.stderr.write = function() {
      throw new Error("Should not be called");
    };

    const h = new handlers.ConsoleHandler();
    h.setFormat("test");

    h.handle({ level: LEVELS.TRACE });
    called.should.be.true();
    called = false;

    h.handle({ level: LEVELS.DEBUG });
    called.should.be.true();
    called = false;

    h.handle({ level: LEVELS.INFO });
    called.should.be.true();
    called = false;

    process.stdout.write = origStdout;
    process.stderr.write = origStderr;
  });

  it("should pass record to stderr if level > INFO", function() {
    let called = false;
    process.stdout.write = function() {
      throw new Error("Should not be called");
    };

    process.stderr.write = function() {
      called = true;
    };

    const h = new handlers.ConsoleHandler();
    h.setFormat("test");

    h.handle({ level: LEVELS.WARN });
    called.should.be.true();
    called = false;

    h.handle({ level: LEVELS.ERROR });
    called.should.be.true();
    called = false;

    process.stdout.write = origStdout;
    process.stderr.write = origStderr;
  });
});

describe("StreamHandler", function() {
  describe("#setStream", function() {
    it("should set stream", function() {
      const h = new handlers.StreamHandler();

      const s = {};
      h.setStream(s);

      h._stream.should.be.equal(s);
    });
  });

  describe("#setShouldFormat", function() {
    it("should set if need format before write", function() {
      const h = new handlers.StreamHandler();
      h.setShouldFormat(false);
      h._shouldFormat.should.be.equal(false);
    });

    it("should have by default to true", function() {
      const h = new handlers.StreamHandler();
      h._shouldFormat.should.be.equal(true);
    });

    it("should format record when true", function() {
      const h = new handlers.StreamHandler();
      h.setFormat("test");
      h.setStream({
        write: function(r) {
          r.should.be.String();
        }
      });
      h.handle({ level: LEVELS.INFO });
    });

    it("should format record when false", function() {
      const h = new handlers.StreamHandler();
      h.setShouldFormat(false);
      const rr = { level: LEVELS.INFO };
      h.setStream({
        write: function(r) {
          r.should.be.equal(rr);
        }
      });
      h.handle(rr);
    });
  });
});

describe("MultiHandler", function() {
  describe("#addHandler", function() {
    it("should add handlers to settings", function() {
      const s = new handlers.MultiHandler();

      const spy = sinon.spy();

      s.addHandler({ handle: spy });
      s.handle({ level: 10 });

      spy.called.should.be.true();
    });
  });

  describe("#handle", function() {
    it("should delegate call to own handlers", function() {
      const s = new handlers.MultiHandler();

      const spy1 = sinon.spy();
      const spy2 = sinon.spy();
      s.addHandler({ handle: spy1 }).addHandler({ handle: spy2 });

      s.handle({ level: 10 });

      spy1.called.should.be.true();
      spy2.called.should.be.true();
    });
  });
});
