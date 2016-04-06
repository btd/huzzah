var EE = require('events').EventEmitter;

var LoggerFactory = require('../factory');
var StreamHandler = require('../handlers').StreamHandler;
var jsonFormat = require('../json-format');

var winston = require('winston');
var intel = require('intel');
var bunyan = require('bunyan');
var log4js = require('log4js').getLogger();
var pino = require('pino')();

var stdout = new EE();
stdout.write = function (out, encoding, cb) {
  if (typeof encoding === 'function') {
    cb = encoding;
    encoding = null;
  }
  cb && cb();
  return true;
};

var f1 = new LoggerFactory().setUseHierarchy(true);
var f1l1 = f1.get('a');
f1.settings('a')
  .addHandler(new StreamHandler().setStream(stdout).setFormat('[%date] %logger:: %message%n'));

var f1l2 = f1.get('b');
f1.settings('b')
  .addHandler(new StreamHandler().setStream(stdout).setFormat(jsonFormat({})));

var f2 = new LoggerFactory().setUseHierarchy(false);
var f2l1 = f2.get('a');
f2.settings('a')
  .addHandler(new StreamHandler().setStream(stdout).setFormat('[%date] %logger:: %message%n'));

var f2l2 = f2.get('b');
f2.settings('b')
  .addHandler(new StreamHandler().setStream(stdout).setFormat(jsonFormat({})));

intel.addHandler(new intel.handlers.Stream({ stream: stdout, formatter: new intel.Formatter('[%(date)s] %(name)s:: %(message)s') }));

winston.add(winston.transports.File, { stream: stdout, timestamp: true });
winston.remove(winston.transports.Console);

var log = bunyan.createLogger({name: 'lr', level: 'debug'});

process.stdout.write = function(msg, enc, callback) {
  if(typeof enc === 'function' && !callback) callback = enc;

  callback && callback();
  return true;
};

var Benchmark = require('benchmark');

var suite = new Benchmark.Suite('logging.info()');

suite
  .add('huzzah.info h=1 text format', function() {
    f1l1.info('asdf');
  })
  .add('huzzah.info h=1 json format', function() {
    f1l2.info('asdf');
  })
  .add('huzzah.info h=0 text format', function() {
    f2l1.info('asdf');
  })
  .add('huzzah.info h=0 json format', function() {
    f2l2.info('asdf');
  })
  .add('winston.info', function() {
    winston.info('asdf');
  })
  .add('intel.info', function() {
    intel.info('asdf');
  })
  .add('bunyan.info', function() {
    log.info('asdf');
  })
  .add('log4js.info', function() {
    log4js.info('asdf');
  })
  .add('pino.info', function() {
    pino.info('asdf');
  });

suite
// add listeners
  .on('cycle', function (event) {
    console.warn(String(event.target));
  })
// run async
  .run();
