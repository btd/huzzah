/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

const Console = require('console').Console;
const EE = require('events').EventEmitter;

const winston = require('winston');
const LoggerFactory = require('../factory');
const StreamHandler = require('../handlers').StreamHandler;
const intel = require('intel');
const bunyan = require('bunyan');
const log4js = require('log4js').getLogger();

var stdout = new EE();
stdout.write = function (out, encoding, cb) {
  if (typeof encoding === 'function') {
    cb = encoding;
    encoding = null;
  }
  cb && cb();
  return true;
};

var _console = new Console(stdout, stdout);

var f = new LoggerFactory();
var l = f.get('root');
f.settings('root')
  .addHandler(new StreamHandler(stdout).setFormat('[%date] %logger:: %message%n'))

intel.addHandler(new intel.handlers.Stream({ stream: stdout, formatter: new intel.Formatter('[%(date)s] %(name)s:: %(message)s') }));

winston.add(winston.transports.File, { stream: stdout, timestamp: true });
winston.remove(winston.transports.Console);

var log = bunyan.createLogger({name: 'lr', level: 'debug'});

process.stdout.write = function(msg, enc, callback) {
  if(typeof enc === 'function' && !callback) callback = enc;

  callback && callback();
  return true;
}

var Benchmark = require('benchmark');

var suite = new Benchmark.Suite('logging.info()');

suite
  .add('console.info', function() {
    _console.info('asdf');
  })
  .add('huzzah.info', function() {
    l.info('asdf');
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

suite
// add listeners
  .on('cycle', function (event) {
    console.warn(String(event.target));
  })
// run async
  .run();
