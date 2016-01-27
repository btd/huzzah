var printf = require('./utils/printf');
var LEVELS = require('./levels');

var PID = process.pid;

/**
 * Produce log records. It could not be create manuall,
 * always use LoggerFactory instance to create loggers.
 *
 * @param {LoggerFactory} factory factory, holding this logger
 * @param {string} name    name of this logger
 * @param {Object} context Set of keys, which will be auto-added to each record
 * @class
 */
function Logger(factory, name, context) {
  this._name = name;
  this._factory = factory;

  this._context = context;
}

Logger.prototype = {
  /**
   * Create log record with given level and arguments.
   * Usually not used.
   *
   * @param  {number} level Log level
   * @param  {Array} args   Arguments
   * @private
   */
  log: function(level, args) {
    var err = args[args.length - 1] instanceof Error ? args.pop(): undefined;

    var record = {
      name: this._name,
      level: level,
      levelname: LEVELS[level],
      args: args,
      pid: PID,
      timestamp: new Date(),
      err: err,
      message: printf(args),
      context: this._context
    };

    this._factory._processRecord(this._name, record);
  },

  /**
   * Creates new Logger with the same name, factory but with given context.
   * Every property and value of context will be added to log record. This
   * can be usefull for json logging
   *
   * @param  {Object} context
   * @return {Logger}         new logger with given context
   */
  with: function(context) {
    // fool check
    if(typeof context !== 'object') {
      throw new Error('`context` must be an Object instance');
    }

    return new Logger(this._factory, this._name, context);
  }
};

function makeLogAtLevelMethod(level) {
  return function() {
    var len = arguments.length;
    var args = new Array(len);
    for(var i = 0; i < len; i++) {
      args[i] = arguments[i];
    }
    this.log(level, args);
  }
}

/**
 * Create log record with level TRACE. If first argument is string, it is used as message format, like console.log do.
 * Supported modifiers %s, %d, %j, %%. If you want to output error, it must be one among all arguments and be last.
 *
 * @param {...*} args Any arguments. Error must be one and last.
 * @example
 *
 * logger.trace('User entered %s', userInput);
 *
 * logger.error('Error happen while sending email', err);
 */
Logger.prototype.trace = makeLogAtLevelMethod(LEVELS.TRACE);

/**
 * Create log record with level DEBUG. If first argument is string, it is used as message format, like console.log do.
 * Supported modifiers %s, %d, %j, %%. If you want to output error, it must be one among all arguments and be last.
 *
 * @param {...*} args Any arguments. Error must be one and last.
 * @example
 *
 * logger.trace('User entered %s', userInput);
 *
 * logger.error('Error happen while sending email', err);
 */
Logger.prototype.debug = makeLogAtLevelMethod(LEVELS.DEBUG);

/**
 * Create log record with level INFO. If first argument is string, it is used as message format, like console.log do.
 * Supported modifiers %s, %d, %j, %%. If you want to output error, it must be one among all arguments and be last.
 *
 * @param {...*} args Any arguments. Error must be one and last.
 * @example
 *
 * logger.trace('User entered %s', userInput);
 *
 * logger.error('Error happen while sending email', err);
 */
Logger.prototype.info = makeLogAtLevelMethod(LEVELS.INFO);

/**
 * Create log record with level WARN. If first argument is string, it is used as message format, like console.log do.
 * Supported modifiers %s, %d, %j, %%. If you want to output error, it must be one among all arguments and be last.
 *
 * @param {...*} args Any arguments. Error must be one and last.
 * @example
 *
 * logger.trace('User entered %s', userInput);
 *
 * logger.error('Error happen while sending email', err);
 */
Logger.prototype.warn = makeLogAtLevelMethod(LEVELS.WARN);

/**
 * Create log record with level ERROR. If first argument is string, it is used as message format, like console.log do.
 * Supported modifiers %s, %d, %j, %%. If you want to output error, it must be one among all arguments and be last.
 *
 * @param {...*} args Any arguments. Error must be one and last.
 * @example
 *
 * logger.trace('User entered %s', userInput);
 *
 * logger.error('Error happen while sending email', err);
 */
Logger.prototype.error = makeLogAtLevelMethod(LEVELS.ERROR);


module.exports = Logger;
