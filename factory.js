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
 * @param  {{handlerConstructor:function}} [opts] Options
 * @class
 */
function LoggerFactory(opts) {
  this._loggers = {};
  this._handler = {};

  opts = opts || {};

  this._handlerConstructor = opts.handlerConstructor || MultiHandler;
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

  _onLog: function(name) {
    var that = this;
    return function onLog(record) {
      var handler = that._handler[name];
      if (handler != null) {
        handler.handle(record);
      }
    };
  },

  _getProperOnLogCallback: function(name) {
    var parents = parentNames(name);
    var parentsLength = parents.length;
    var callbacks = [];

    for (var i = 0; i < parentsLength; i++) {
      callbacks.unshift(this._onLog(parents[i]));
    }

    var len = callbacks.length;
    var p1, p2, p3;
    switch (len) {
      case 0:
        return function onLog$0() {};
      case 1:
        return callbacks[0];
      case 2:
        p1 = callbacks[0];
        p2 = callbacks[1];
        return function onLog$2(record) {
          p1(record);
          p2(record);
        };
      case 3:
        p1 = callbacks[0];
        p2 = callbacks[1];
        p3 = callbacks[2];
        return function onLog$3(record) {
          p1(record);
          p2(record);
          p3(record);
        };
      default:
        return function onLog(record) {
          var l = len;
          while (l--) {
            callbacks[l](record);
          }
        };
    }
  },

  _createNewLogger: function(name) {
    return new Logger(this._getProperOnLogCallback(name), name);
  },

  _createNewHandler: function() {
    return new this._handlerConstructor();
  },

  /**
   * Returns settings for logger with given name
   * @param  {string} name logger name
   * @deprecated
   * @return {Handler}
   */
  settings: function(name) {
    return this.handler(name);
  },

  /**
   * Returns hander for logger with given name
   * @param  {string} name logger name
   * @return {Handler}
   */
  handler: function(name) {
    this._handler[name] = this._handler[name] || this._createNewHandler();
    return this._handler[name];
  }
};

module.exports = LoggerFactory;
