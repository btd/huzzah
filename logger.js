var LEVELS = require('./levels');

var SEP = '.';
var ROOT = 'root';

function parentNames(name) {
  var names = [];
  var parts = name.split(SEP);
  while(parts.length) {
    names.push(parts.join(SEP));
    parts.pop();
  }
  names.push(ROOT);
  return names;
}

/**
 * Produce log records. It could not be create manuall,
 * always use LoggerFactory instance to create loggers.
 *
 * @param {LoggerFactory} factory factory, holding this logger
 * @param {string} name    name of this logger
 * @class
 */
function Logger(factory, name) {
  this._names = parentNames(name);
  this._factory = factory;
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
    this._factory.log(this._names, level, args);
  }
}

var SLICE = Array.prototype.slice;

function defineLogLevelMethod(name, level) {
  Logger.prototype[name] = function() {
    this.log(level, SLICE.call(arguments));
  }
}

/**
 * Create log record with level TRACE. If first argument is string, it is used as message format, like console.log do.
 * Supported modifiers %s, %d, %j, %%. If you want to output error, it must be one among all arguments and be last.
 *
 * @memberof Logger
 * @instance
 * @param {...*} args Any arguments. Error must be one and last.
 * @name trace
 * @example
 *
 * logger.trace('User entered %s', userInput);
 *
 * logger.error('Error happen while sending email', err);
 */
defineLogLevelMethod('trace', LEVELS.TRACE);

/**
 * Create log record with level DEBUG. If first argument is string, it is used as message format, like console.log do.
 * Supported modifiers %s, %d, %j, %%. If you want to output error, it must be one among all arguments and be last.
 *
 * @memberof Logger
 * @instance
 * @param {...*} args Any arguments. Error must be one and last.
 * @name debug
 * @example
 *
 * logger.trace('User entered %s', userInput);
 *
 * logger.error('Error happen while sending email', err);
 */
defineLogLevelMethod('debug', LEVELS.DEBUG);

/**
 * Create log record with level INFO. If first argument is string, it is used as message format, like console.log do.
 * Supported modifiers %s, %d, %j, %%. If you want to output error, it must be one among all arguments and be last.
 *
 * @memberof Logger
 * @instance
 * @param {...*} args Any arguments. Error must be one and last.
 * @name info
 * @example
 *
 * logger.trace('User entered %s', userInput);
 *
 * logger.error('Error happen while sending email', err);
 */
defineLogLevelMethod('info' , LEVELS.INFO );

/**
 * Create log record with level WARN. If first argument is string, it is used as message format, like console.log do.
 * Supported modifiers %s, %d, %j, %%. If you want to output error, it must be one among all arguments and be last.
 *
 * @memberof Logger
 * @instance
 * @param {...*} args Any arguments. Error must be one and last.
 * @name warn
 * @example
 *
 * logger.trace('User entered %s', userInput);
 *
 * logger.error('Error happen while sending email', err);
 */
defineLogLevelMethod('warn' , LEVELS.WARN );

/**
 * Create log record with level ERROR. If first argument is string, it is used as message format, like console.log do.
 * Supported modifiers %s, %d, %j, %%. If you want to output error, it must be one among all arguments and be last.
 *
 * @memberof Logger
 * @instance
 * @param {...*} args Any arguments. Error must be one and last.
 * @name error
 * @example
 *
 * logger.trace('User entered %s', userInput);
 *
 * logger.error('Error happen while sending email', err);
 */
defineLogLevelMethod('error', LEVELS.ERROR);

Logger.ROOT = ROOT;

module.exports = Logger;
