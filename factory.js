var Logger = require('./logger');
var LoggerSettings = require('./settings');

/**
 * Handler logger and its settings manipulation
 *
 * @class
 */
function LoggerFactory() {
  this._loggers = {};
  this._settings = {};
}

LoggerFactory.prototype = {

  /**
   * Returns logger with given name
   * @param  {string} name Name of logger
   * @return {Logger}
   */
  get: function(name) {
    this._loggers[name] = this._loggers[name] || new Logger(this, name);
    return this._loggers[name];
  },

  /**
   * @private
   */
  log: function(names, record) {
    names.forEach(function(loggerName) {
      var settings = this._settings[loggerName];
      if(settings) {
        settings.handle(record);
      }
    }, this);
  },

  /**
   * Returns settings for logger with given name
   * @param  {string} name logger name
   * @return {LoggerSettings}
   */
  settings: function(name) {
    this._settings[name] = this._settings[name] || new LoggerSettings();
    return this._settings[name];
  }
}

module.exports = LoggerFactory;
