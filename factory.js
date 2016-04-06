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

  this._useHierarchy = true;
}

LoggerFactory.prototype = {
  /**
   * Set internal value to create loggers with parents. It means if it set to false
   * all loggers have one single parent 'root' and all loggers configured via this 'root' logger.
   *
   * @param  {Boolean} value
   * @return {this}
   */
  setUseHierarchy: function(value) {
    this._useHierarchy = !!value;
    return this;
  },

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

  _getProperOnLogCallback: function(name) {
    if(this._useHierarchy) {
      var parents = parentNames(name);
      var parentsLength = parents.length;
      var parentSettings = [];

      for(var i = 0; i < parentsLength; i++) {
        parentSettings.push(this.settings(parents[i]));
      }

      var len = parentSettings.length;
      return function onLog(record) {
        for(var i = 0; i < len; i++) {
          parentSettings[i].handle(record);
        }
      };
    } else {
      var settings = this.settings(ROOT);

      return function onLog(record) {
        settings.handle(record);
      };
    }
  },

  _createNewLogger: function(name) {
    return new Logger(this._getProperOnLogCallback(name), name);
  },

  _createNewSettings: function() {
    return new LoggerSettings();
  },

  /**
   * Returns settings for logger with given name
   * @param  {string} name logger name
   * @return {LoggerSettings}
   */
  settings: function(name) {
    this._settings[name] = this._settings[name] || this._createNewSettings();
    return this._settings[name];
  }
};

module.exports = LoggerFactory;
