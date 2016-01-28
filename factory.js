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
      logger = this._createNewLogger(name);
      this._loggers[name] = logger;
    }
    return logger;
  },

  _createNewLogger(name) {
    var that = this;
    var chain = parentNames(name);
    var chainLength = chain.length;
    return new Logger(function(record) {
      for(var i = 0; i < chainLength; i++) {
        var settings = that._settings[chain[i]];
        if(settings) {
          settings.handle(record);
        }
      }
    }, name);
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
};

module.exports = LoggerFactory;
