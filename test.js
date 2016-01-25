var LoggerFactory = require('./factory');
var ConsoleHandler = require('./handlers').ConsoleHandler;

var f = new LoggerFactory();

var logger = f.get('a.b');


f.settings('a.b')
  .addHandler(new ConsoleHandler(true))

f.settings('a')
  .setLevel('WARN')

  .addHandler(new ConsoleHandler().setFormat('[%date000] %highlight(%-5level) %cyan.bold(%logger) - %% %message%n%error'))

logger.trace('Boom');
logger.error(new Error('boom'));
logger.warn('Everything seems ok');
