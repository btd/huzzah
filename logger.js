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
 * Create log record with level trace
 *
 * @memberof Logger
 * @instance
 * @param {...*} args Any arguments. Error must be one and last
 * @name trace
 */
defineLogLevelMethod('trace', LEVELS.TRACE);

/**
 * Create log record with level debug
 *
 * @memberof Logger
 * @instance
 * @param {...*} args Any arguments. Error must be one and last
 * @name debug
 */
defineLogLevelMethod('debug', LEVELS.DEBUG);

/**
 * Create log record with level info
 *
 * @memberof Logger
 * @instance
 * @param {...*} args Any arguments. Error must be one and last
 * @name info
 */
defineLogLevelMethod('info' , LEVELS.INFO );

/**
 * Create log record with level warn
 *
 * @memberof Logger
 * @instance
 * @param {...*} args Any arguments. Error must be one and last
 * @name warn
 */
defineLogLevelMethod('warn' , LEVELS.WARN );

/**
 * Create log record with level error
 *
 * @memberof Logger
 * @instance
 * @param {...*} args Any arguments. Error must be one and last
 * @name error
 */
defineLogLevelMethod('error', LEVELS.ERROR);

Logger.ROOT = ROOT;

module.exports = Logger;
