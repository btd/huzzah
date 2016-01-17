var printf = require('./utils/printf');
var LEVELS = require('./levels');
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
  log: function(names, level, args) {
    var err = args[args.length - 1] instanceof Error ? args.pop(): null;
    var name = names[0];
    var pid = process.pid;
    var timestamp = new Date();
    var message = printf(args);
    var levelname = LEVELS[level];

    names.forEach(function(name) {
      var settings = this._settings[name];
      if(settings) {
        settings.handle({
          name: name,
          level: level,
          levelname: levelname,
          args: args,
          pid: pid,
          timestamp: timestamp,
          err: err,
          message: message
        });
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
  },
}

module.exports = LoggerFactory;
