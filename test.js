'use strict';

const LoggerFactory = require('./factory');
const ConsoleHandler = require('./handlers').ConsoleHandler;

let f = new LoggerFactory();

let logger = f.get('a.b');


f.settings('a.b')
  .addHandler(new ConsoleHandler(true))

f.settings('a')
  .setLevel('WARN')

  .addHandler(new ConsoleHandler().setFormat('[%date] %-5level %logger - %% %message%n%error'))

logger.trace('Boom');
logger.error(new Error('boom'));
logger.warn('Everything seems ok');
