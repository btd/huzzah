var Logger = require('./logger');
var LoggerSettings = require('./settings');


var SEP = '.';
var ROOT = 'root';
var NOOP = function() {};

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
function LoggerFactory(opts) {
  opts = opts || {};

  this._loggers = {};
  this._settings = {};

  this._useHierarchy = typeof opts.useHierarchy === 'undefined' ? true : !!opts.useHierarchy;
  this._useFixedLoggers = typeof opts.useFixedLoggers === 'undefined' ? false : !!opts.useFixedLoggers;
}

LoggerFactory.prototype = {
  /**
   * Set internal value to create loggers with parents. It means if it set to false
   * when logger created never assumed it has parent loggers.
   *
   * @param  {Boolean} value
   * @return {this}
   */
  setUseHierarchy: function(value) {
    this._useHierarchy = !!value;
    return this;
  },

  /**
   * Set internal value to fix loggers after creation. It literally means, that after logger
   * created its settings never changed.
   *
   * @param  {Boolean} value
   * @return {this}
   */
  setUseFixedLoggers: function(value) {
    this._useFixedLoggers = !!value;
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
    var that = this;
    var settings;
    var chain;
    var chainLength;

    if(this._useHierarchy) {
      if(this._useFixedLoggers) {

        chain = parentNames(name);
        chainLength = chain.length;
        settings = [];

        for(var i = 0; i < chainLength; i++) {
          var s = this._settings[chain[i]];
          if(s) {
            settings.push(s);
          }
        }

        var len = settings.length;
        return function onLog(record) {
          for(var i = 0; i < len; i++) {
            settings[i].handle(record);
          }
        };
      } else {
        chain = parentNames(name);
        chainLength = chain.length;

        return function onLog(record) {
          for(var i = 0; i < chainLength; i++) {
            var settings = that._settings[chain[i]];
            if(settings) {
              settings.handle(record);
            }
          }
        };
      }
    } else {
      if(this._useFixedLoggers) {
        settings = this._settings[name];

        return settings ?
          function onLog(record) {
            settings.handle(record);
          } :
          NOOP;
      } else {
        return function onLog(record) {
          var settings = that._settings[name];
          if(settings) {
            settings.handle(record);
          }
        };
      }
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
