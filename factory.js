var Logger = require("./logger");
var MultiHandler = require("./handlers").MultiHandler;

var SEP = ".";
var ROOT = "root";

function parentNames(name) {
  var names = [];
  var parts = name.split(SEP);
  while (parts.length) {
    names.push(parts.join(SEP));
    parts.pop();
  }
  names.push(ROOT);
  return names;
}

/**
 * Handler logger and its settings manipulation.
 * Default factory returned when you call `require("huzzah")`.
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
    if (!logger) {
      logger = this._createNewLogger(name);
      this._loggers[name] = logger;
    }
    return logger;
  },

  _getProperOnLogCallback: function(name) {
    var parents = parentNames(name);
    var parentsLength = parents.length;
    var parentSettings = [];

    for (var i = 0; i < parentsLength; i++) {
      parentSettings.unshift(this.settings(parents[i]));
    }

    var len = parentSettings.length;
    switch (len) {
      case 0:
        return function onLog$0() {};
      case 1:
        var root = parentSettings[0];
        return function onLog$root(record) {
          root.handle(record);
        };
      default:
        return function onLog(record) {
          var l = len;
          while (l--) {
            parentSettings[l].handle(record);
          }
        };
    }
  },

  _createNewLogger: function(name) {
    return new Logger(this._getProperOnLogCallback(name), name);
  },

  _createNewSettings: function() {
    return new MultiHandler();
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
