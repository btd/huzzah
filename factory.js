"use strict";

const Logger = require("./logger");
const { MultiHandler } = require("./handlers");

const SEP = ".";
const ROOT = "root";

function parentNames(name) {
  const names = [];
  const parts = name.split(SEP);
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
class LoggerFactory {
  constructor(opts = { handlerConstructor: MultiHandler }) {
    this._loggers = {};
    this._handlers = {};

    this._handlerConstructor = opts.handlerConstructor;
  }

  /**
   * Returns logger with given name
   * @param  {string} name Name of logger
   * @return {Logger}
   */
  get(name) {
    let logger = this._loggers[name];
    if (!logger) {
      logger = this._createNewLogger(name);
      this._loggers[name] = logger;
    }
    return logger;
  }

  _onLog(name) {
    const that = this;
    return function onLog(record) {
      const handler = that._handlers[name];
      if (handler != null) {
        handler.handle(record);
      }
    };
  }

  _getProperOnLogCallback(name) {
    const parents = parentNames(name);
    const parentsLength = parents.length;
    const callbacks = [];

    for (let i = 0; i < parentsLength; i++) {
      callbacks.unshift(this._onLog(parents[i]));
    }

    const len = callbacks.length;
    let p1, p2, p3;
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
          let l = len;
          while (l--) {
            callbacks[l](record);
          }
        };
    }
  }

  _createNewLogger(name) {
    return new Logger(this._getProperOnLogCallback(name), name);
  }

  _createNewHandler() {
    return new this._handlerConstructor();
  }

  /**
   * Returns settings for logger with given name
   * @param  {string} name logger name
   * @deprecated
   * @return {Handler}
   */
  settings(name) {
    return this.handler(name);
  }

  /**
   * Returns hander for logger with given name
   * @param  {string} name logger name
   * @return {Handler}
   */
  handler(name) {
    this._handlers[name] = this._handlers[name] || this._createNewHandler();
    return this._handlers[name];
  }
}

module.exports = LoggerFactory;
