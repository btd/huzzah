var Logger = require('./logger');
var LoggerSettings = require('./settings');


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

var loggersChainCache = {};

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
    var logger = this._loggers[name];
    if(!logger) {
      logger = new Logger(this, name);
      loggersChainCache[name] = parentNames(name)
      this._loggers[name] = logger;
    }
    return logger;
  },

  /**
   * @private
   */
  _processRecord: function(name, record) {
    loggersChainCache[name].forEach(function(loggerName) {
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
