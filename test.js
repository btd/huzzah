var LoggerFactory = require('./factory');
var ConsoleHandler = require('./handlers').ConsoleHandler;

const strftimeCompile = require('./utils/strftime');

var jsonFormat = require('./json-format');

var f = new LoggerFactory();

var logger = f.get('a.b');

f.settings('a.b')
  .addHandler(new ConsoleHandler().setFormat(jsonFormat({
    timestamp: strftimeCompile('%Y/%m/%d %H:%M:%S,%L000')
  })));

f.settings('a')
  .setLevel('WARN')

  .addHandler(new ConsoleHandler().setFormat('[%date000] %highlight(%-5level) %cyan.bold(%logger) - %% %message%n%error'))

logger.trace('Boom');
logger.error(new Error('boom'));
logger.warn('Everything seems ok');

logger.with({ a: 10 }).warn(new Error('boom'));
