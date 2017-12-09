/*eslint-env mocha*/
"use strict";

const jsonFormat = require("./json-format");

const rec = {
  level: 30,
  levelname: "INFO",
  logger: "logger_name",
  message: "text message",
  err: new Error("boom"),
  timestamp: new Date("2016-01-29T09:04:19.720Z"),
  context: {
    a: 10,
    b: "abc"
  },
  v: 0
};

describe("JSON Format", function() {
  it("should be possible to replace any context variable", function() {
    const format = jsonFormat({
      context: {
        a: function() {
          return { level: "super" };
        }
      }
    });
    const recordString = format(rec);
    JSON.parse(recordString).should.be.eql({
      context: { a: { level: "super" }, b: "abc" },
      level: 30,
      err: {
        message: rec.err.message,
        name: rec.err.name,
        stack: rec.err.stack
      },
      levelname: "INFO",
      message: "text message",
      logger: "logger_name",
      timestamp: "2016-01-29T09:04:19.720Z",
      v: 0
    });
  });
});
