"use strict";

const printf = require("./utils/printf");
const LEVELS = require("./levels");

/**
 * Produce log records. It could not be created manually,
 * always use LoggerFactory instance to create loggers.
 *
 * @param {function} onLogCallback factory, holding this logger
 * @param {string} name    name of this logger
 * @param {Object} context Set of keys, which will be auto-added to each record
 * @class
 */
class Logger {
  constructor(onLogCallback, name, context) {
    this._onLogCallback = onLogCallback;
    this._name = name;
    this._context = context;
  }

  /**
   * Create log record with given level and arguments.
   * Usually not used.
   *
   * @param  {number} level Log level
   * @param  {Array} args   Arguments
   * @private
   */
  log(level, args) {
    const err = args.length > 0 && args[args.length - 1] instanceof Error ? args.pop() : undefined;

    const record = {
      logger: this._name,
      level: level,
      levelname: LEVELS[level],
      args: args,
      timestamp: Date.now(),
      err: err,
      message: printf(args),
      context: this._context
    };

    this._onLogCallback(record);
  }

  /**
   * Creates new Logger with the same name, factory but with given context.
   * Every property and value of context will be added to log record. This
   * can be usefull for json logging
   *
   * @param  {Object} context
   * @return {Logger}         new logger with given context
   */
  with(context) {
    // fool check
    if (typeof context !== "object" || context == null) {
      throw new Error("`context` must be an Object instance");
    }

    return new Logger(this._onLogCallback, this._name, context);
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
  trace(...args) {
    this.log(LEVELS.TRACE, args);
  }

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
  debug(...args) {
    this.log(LEVELS.DEBUG, args);
  }

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
  info(...args) {
    this.log(LEVELS.INFO, args);
  }

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
  warn(...args) {
    this.log(LEVELS.WARN, args);
  }

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
  error(...args) {
    this.log(LEVELS.ERROR, args);
  }
}

module.exports = Logger;
