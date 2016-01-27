const EE = require('events').EventEmitter;

const LoggerFactory = require('./factory');
const StreamHandler = require('./handlers').StreamHandler;
var jsonFormat = require('./json-format');

var stdout = new EE();
stdout.write = function (out, encoding, cb) {
  if (typeof encoding === 'function') {
    cb = encoding;
    encoding = null;
  }
  cb && cb();
  return true;
};

var f = new LoggerFactory();
var l1 = f.get('a');
f.settings('a')
  .addHandler(new StreamHandler(stdout).setFormat('[%date] %logger:: %message%n'));

var l2 = f.get('b');
f.settings('b')
  .addHandler(new StreamHandler(stdout).setFormat(jsonFormat({})));


var Benchmark = require('benchmark');

var suite = new Benchmark.Suite('logging.info()');

suite
  .add('huzzah.info text format', function() {
    l1.info('asdf');
  })
  .add('huzzah.info json format', function() {
    l2.info('asdf');
  });

suite
// add listeners
  .on('cycle', function (event) {
    console.warn(String(event.target));
  })
// run async
  .run();
