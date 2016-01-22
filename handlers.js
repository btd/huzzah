var LEVELS = require('./levels');

var compileFormat = require('./utils/format');

/**
 * Basic handler. Does not actually handle anything.
 * Usefull for extensions and stubs
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
    if(typeof level === 'string') {
      level = LEVELS[level.toUpperCase()];
    }
    if(typeof level !== 'number' || !(level in LEVELS)) {
      throw new Error(`${level} does not exists`);
    }
    this._level = level;
    return this;
  },

  enabledFor: function(level) {
    return this._level <= level;
  },

  handle: function(record) {
    if(this.enabledFor(record.level)) {
      this._handle(record);
    }
  },

  _handle() {
  }
}

module.exports.NullHandler = NullHandler;

var DEFAULT_FORMAT = '%date %-5level %logger - %message%n%error';

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
 * @param  {string|function} format - It is either formatted string as described, or function returning string and accepts just one argument log record
 * @return {this}
 */
BaseHandler.prototype.setFormat = function(format) {
  if(typeof format === 'string') {
    this.formatRecord = compileFormat(format);
  } else if(typeof format === 'function') {
    this.formatRecord = format;
  }
  return this;
}

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
  if(record.level > LEVELS.INFO) {
    process.stderr.write(line);
  } else {
    process.stdout.write(line);
  }
}

module.exports.ConsoleHandler = ConsoleHandler;

/**
 * Allow to pass records
 * @param {WritableStream} stream Stream to write
 * @param {boolean} shouldFormat Should we format string to be text lines instead of objects
 */
function StreamHandler(stream, shouldFormat) {
  BaseHandler.call(this);

  this
    .setStream(stream)
    .setShouldFormat(typeof shouldFormat === 'undefined' ? true: !!shouldFormat)
}

StreamHandler.prototype = Object.create(BaseHandler.prototype);
StreamHandler.prototype._handle = function(record) {
  var out = this._shouldFormat ? this.formatRecord(record) : record;
  this._stream.write(out);
}

/**
 * @param  {boolean} value
 * @return {this}
 */
StreamHandler.prototype.setShouldFormat = function(value) {
  this._shouldFormat = value;
  return this;
}

/**
 * @param  {WritableStream} stream
 * @return {this}
 */
StreamHandler.prototype.setStream = function(stream) {
  this._stream = stream;
  return this;
}

module.exports.StreamHandler = StreamHandler;
