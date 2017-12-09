/*eslint-env mocha*/
"use strict";

const quote = require("./quote");
const compileMessage = require("./message");
require("should");

const EOL = "\n";

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
  }
};

const testCases = [
  ["test", "test"],

  ["%c", rec.logger],
  ["%lo", rec.logger],
  ["%logger", rec.logger],

  ["%p", rec.levelname],
  ["%le", rec.levelname],
  ["%level", rec.levelname],

  ["%m", rec.message],
  ["%msg", rec.message],
  ["%message", rec.message],

  [
    "%err",
    rec.err.stack
      .split("\n")
      .map(function(line) {
        return "  " + line;
      })
      .join("\n") + "\n"
  ],
  [
    "%error",
    rec.err.stack
      .split("\n")
      .map(function(line) {
        return "  " + line;
      })
      .join("\n") + "\n"
  ],

  // XXX it is env specific, find better way
  //['%d', '2016/01/29 12:04:19,720'],
  //['%date', '2016/01/29 12:04:19,720'],

  ["%d{%Y}", "2016"],
  ["%date{%Y}", "2016"],

  ["%x", '{"a":10,"b":"abc"}'],
  ["%x{b}", '"abc"'],

  ["%n", EOL],

  ["[%20.20logger]", "[         logger_name]"],
  ["[%-20.20logger]", "[logger_name         ]"],

  ["[%10.10logger]", "[ogger_name]"],
  ["[%10.-10logger]", "[logger_nam]"],

  [" %logger %msg ", " logger_name text message "]
];

describe("Patter Layout", function() {
  testCases.forEach(function(testCase) {
    it("should match " + quote(testCase[0]) + " to " + quote(String(testCase[1])), function() {
      compileMessage(testCase[0])(rec).should.be.equal(String(testCase[1]));
    });
  });

  it("should throw when used not variable that does not exist", function() {
    (function() {
      compileMessage("%e");
    }.should.throw());
  });
});
