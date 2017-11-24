var LEVELS = require("./levels");

var compileFormat = require("./utils/message");

/**
 * Basic handler. Does not actually handle anything.
 * Usefull for extensions and stubs. All implementors must implement _handle(record)
 * method. record instance shared among all handlers, do not modify it.
 *
 */
function NullHandler() {
  this._level = LEVELS.ALL;
}

NullHandler.prototype = {
  /**
   * Set max accepted log level for this handler
   * @param  {string} level
   * @return {this}
   */
  setLevel: function(level) {
    if (typeof level === "string") {
      level = LEVELS[level.toUpperCase()];
    }
    if (typeof level !== "number" || !(level in LEVELS)) {
      throw new Error(level + " does not exists");
    }
    this._level = level;
    return this;
  },

  _enabledFor: function(record) {
    return this._level <= record.level;
  },

  handle: function(record) {
    if (this._enabledFor(record)) {
      this._handle(record);
    }
  },

  _handle: function() {}
};

module.exports.NullHandler = NullHandler;

/**
 * Holds settings of one logger.
 * It is max accepted log level and handlers
 *
 * @class
 * @extends NullHandler
 */
function MultiHandler() {
  NullHandler.call(this);

  this._handle = function _noop$_handle() {};
}

MultiHandler.prototype = Object.create(NullHandler.prototype);

/**
 * Adds handler to logger
 * @param  {NullHandler} handler instance
 * @return {this}
 */
MultiHandler.prototype.addHandler = function(handler) {
  var prev = this._handle;
  this._handle = function _handle(record) {
    handler.handle(record);
    prev(record);
  };
  return this;
};

module.exports.MultiHandler = MultiHandler;

var DEFAULT_FORMAT = "%date %-5level %logger - %message%n%error";

/**
 * Used as base class for most handlers
 * All extensions should implement method `_handle(record)`
 */
function BaseHandler() {
  NullHandler.call(this);

  this.setFormat(DEFAULT_FORMAT);
}

BaseHandler.prototype = Object.create(NullHandler.prototype);

/**
 * Set log record format for this handler.
 * Default record format is `[%date] %-5level %logger - %message%n%error`
 *
 * Possible parameters:
 * - `%d{FORMAT}` or `%date{FORMAT}` - how to format record timestamp. `{FORMAT}` is optional stftime string, by default it is `%Y/%m/%d %H:%M:%S,%L`
 * - `%pid` - output process.pid
 * - `%level` or `%le` or `%p` - output record level name like ERROR or WARN
 * - `%logger` or `%lo` or `%c` - output logger name
 * - `%%` - output %
 * - `%n` - output EOL
 * - `%err` or `%error` - output stack trace of passed error
 * - `%x` or `%x{field}` - output JSON.stringified value of context field
 *
 * Also available text decorators (now only colors):
 * - `%highlight(text)` - will decorate passed text with record level decorator
 * - `%cyan(text)`
 * - other colors
 * - `%cyan.bold(text)`
 * - other bold colors
 *
 * Example: `%date000 %highlight(%5level) %cyan(%logger) - %message%n%error`
 *
 * Also it is possible to set it to function. One of possible examples jsonFormat (`require('huzzah/json-format')` ).
 * It can accept the same serializers bunyan can accept and you will have json output at the end.
 *
 * @param  {string|function} format - It is either formatted string as described, or function returning string and accepts just one argument log record
 * @return {this}
 * @example
 * var f = new LoggerFactory();
 *
 * var logger = f.get('a.b');
 *
 * f.settings('a.b')
 *   .addHandler(new ConsoleHandler().setFormat(jsonFormat({
 *     timestamp: strftimeCompile('%Y/%m/%d %H:%M:%S,%L000')
 *   })));
 */
BaseHandler.prototype.setFormat = function(format) {
  switch (typeof format) {
    case "string":
      this.formatRecord = compileFormat(format);
      break;

    case "function":
      this.formatRecord = format;
      break;
    default:
      throw new Error("`format` can be function or string");
  }
  return this;
};

module.exports.BaseHandler = BaseHandler;

/**
 * Just simple console handler
 */
function ConsoleHandler() {
  BaseHandler.call(this);
}

ConsoleHandler.prototype = Object.create(BaseHandler.prototype);
ConsoleHandler.prototype._handle = function(record) {
  var line = this.formatRecord(record);
  if (record.level > LEVELS.INFO) {
    process.stderr.write(line);
  } else {
    process.stdout.write(line);
  }
};

module.exports.ConsoleHandler = ConsoleHandler;

/**
 * Like ConsoleHandler but output whole record to console. This can be usefull
 * in browser to see inspections.
 */
function RawConsoleHandler() {
  BaseHandler.call(this);
}

RawConsoleHandler.prototype = Object.create(BaseHandler.prototype);
RawConsoleHandler.prototype._handle = function(record) {
  if (record.level < LEVELS.INFO) {
    console.log(record);
  } else if (record.level < LEVELS.WARN) {
    console.info(record);
  } else if (record.level < LEVELS.ERROR) {
    console.warn(record);
  } else {
    console.error(record);
  }
};

module.exports.RawConsoleHandler = RawConsoleHandler;

/**
 * Allow to pass records to stream
 */
function StreamHandler() {
  BaseHandler.call(this);

  this.setShouldFormat(true);
}

StreamHandler.prototype = Object.create(BaseHandler.prototype);
StreamHandler.prototype._handle = function(record) {
  var out = this._shouldFormat ? this.formatRecord(record) : record;
  this._stream.write(out);
};

/**
 * Should we format record before passing to stream? By default it is true
 * @param  {boolean} value
 * @return {this}
 */
StreamHandler.prototype.setShouldFormat = function(value) {
  this._shouldFormat = value;
  return this;
};

/**
 * Stream to pass records
 * @param  {WritableStream} stream
 * @return {this}
 */
StreamHandler.prototype.setStream = function(stream) {
  this._stream = stream;
  return this;
};

module.exports.StreamHandler = StreamHandler;
