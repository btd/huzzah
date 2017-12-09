/*eslint-env mocha*/
"use strict";

const LoggerFactory = require("./factory");
const ConsoleHandler = require("./handlers").ConsoleHandler;

const strftimeCompile = require("./utils/strftime");

const jsonFormat = require("./json-format");

const f = new LoggerFactory();

const logger = f.get("a.b");

f.settings("a.b").addHandler(
  new ConsoleHandler().setFormat(
    jsonFormat({
      timestamp: strftimeCompile("%Y/%m/%d %H:%M:%S,%L000")
    })
  )
);

f
  .settings("a")
  .setLevel("WARN")

  .addHandler(
    new ConsoleHandler().setFormat(
      "[%date{%Y/%m/%d %H:%M:%S,%L000|UTC}] %highlight(%-5level) [%cyan.bold(%20.20logger)] - %% %message %x{a}%n%error"
    )
  );

logger.trace("Boom");
logger.error(new Error("boom"));
logger.warn("Everything seems ok");

logger.with({ a: 10 }).warn(new Error("boom"));
