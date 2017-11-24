var EE = require("events").EventEmitter;

var LoggerFactory = require("../factory");
var StreamHandler = require("../handlers").StreamHandler;
var jsonFormat = require("../json-format");

var bunyan = require("bunyan");
var pino = require("pino");
var pinoLogger = pino({ timestamp: pino.stdTimeFunctions.slowTime });
var pinoLoggerFast = pino({});

var stdout = new EE();
stdout.write = function(out, encoding, cb) {
  if (typeof encoding === "function") {
    cb = encoding;
    encoding = null;
  }
  cb && cb();
  return true;
};

var f1 = new LoggerFactory();

var l1 = f1.get("a");
f1.settings("a").addHandler(
  new StreamHandler().setStream(stdout).setFormat(
    jsonFormat({
      timestamp: function(t) {
        return t.getTime();
      }
    })
  )
);

var l2 = f1.get("b");
f1.settings("b").addHandler(new StreamHandler().setStream(stdout).setFormat(jsonFormat()));

var l3 = f1.get("c");

var l4 = f1.get("e");
f1.settings("e").addHandler(
  new StreamHandler()
    .setStream(stdout)
    .setShouldFormat(false)
    .setFormat(jsonFormat())
);

var log = bunyan.createLogger({ name: "lr", level: "debug" });

process.stdout.write = function(msg, enc, callback) {
  if (typeof enc === "function" && !callback) callback = enc;

  callback && callback();
  return true;
};

var Benchmark = require("benchmark");

var suite = new Benchmark.Suite("logging.info()");

suite
  .add("huzzah-fast-time.info json format", function() {
    l1.info("asdf");
  })
  .add("huzzah.info json format", function() {
    l2.info("asdf");
  })
  .add("huzzah.info empty", function() {
    l3.info("asdf");
  })
  .add("huzzah.info no format", function() {
    l4.info("asdf");
  })
  .add("bunyan.info", function() {
    log.info("asdf");
  })
  .add("pino.info", function() {
    pinoLogger.info("asdf");
  })
  .add("pino-fast-time.info", function() {
    pinoLoggerFast.info("asdf");
  });

suite
  // add listeners
  .on("cycle", function(event) {
    console.warn(String(event.target));
  })
  // run async
  .run();
