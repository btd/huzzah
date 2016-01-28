var NullHandler = require('./handlers').NullHandler;

/**
 * Holds settings of one logger.
 * It is max accepted log level and handlers
 *
 * @class
 * @extends NullHandler
 */
function LoggerSettings() {
  NullHandler.call(this);

  this._handlers = [];
}

/**
 * Set max accepted log level. Default value ALL.
 * It means if you set log level for this logger to INFO, than
 * all lower leveled record will be rejected (e.g DEBUG and TRACE).
 * To completely disable all logs set to OFF
 * @param  {string} level
 * @return {this}
 * @name setLevel
 * @memberof LoggerSettings
 * @instance
 */


LoggerSettings.prototype = Object.create(NullHandler.prototype);
LoggerSettings.prototype._handle = function(record) {
  for(var i = 0, len = this._handlers.length; i < len; i++) {
    this._handlers[i].handle(record);
  }
};

/**
 * Adds handler to logger
 * @param  {NullHandler} handler instance
 * @return {this}
 */
LoggerSettings.prototype.addHandler = function(handler) {
  this._handlers.push(handler);
  return this;
};

module.exports = LoggerSettings;
