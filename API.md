# LoggerFactory

[factory.js:26-29](https://github.com/btd/huzzah/blob/f8c3bfd67f6149564a96e1b1f452b2ced3ebf929/factory.js#L26-L29 "Source code on GitHub")

Handler logger and its settings manipulation

## get

[factory.js:38-46](https://github.com/btd/huzzah/blob/f8c3bfd67f6149564a96e1b1f452b2ced3ebf929/factory.js#L38-L46 "Source code on GitHub")

Returns logger with given name

**Parameters**

-   `name` **string** Name of logger

Returns **Logger** 

## settings

[factory.js:65-68](https://github.com/btd/huzzah/blob/f8c3bfd67f6149564a96e1b1f452b2ced3ebf929/factory.js#L65-L68 "Source code on GitHub")

Returns settings for logger with given name

**Parameters**

-   `name` **string** logger name

Returns **LoggerSettings** 

# LoggerSettings

[settings.js:10-14](https://github.com/btd/huzzah/blob/f8c3bfd67f6149564a96e1b1f452b2ced3ebf929/settings.js#L10-L14 "Source code on GitHub")

Holds settings of one logger.
It is max accepted log level and handlers

## addHandler

[settings.js:41-44](https://github.com/btd/huzzah/blob/f8c3bfd67f6149564a96e1b1f452b2ced3ebf929/settings.js#L41-L44 "Source code on GitHub")

Adds handler to logger

**Parameters**

-   `handler` **NullHandler** instance

Returns **this** 

## setLevel

[settings.js:29-29](https://github.com/btd/huzzah/blob/f8c3bfd67f6149564a96e1b1f452b2ced3ebf929/settings.js#L29-L29 "Source code on GitHub")

Set max accepted log level. Default value ALL.
It means if you set log level for this logger to INFO, than
all lower leveled record will be rejected (e.g DEBUG and TRACE).
To completely disable all logs set to OFF

**Parameters**

-   `level` **string** 

Returns **this** 

# BaseHandler

[handlers.js:55-59](https://github.com/btd/huzzah/blob/f8c3bfd67f6149564a96e1b1f452b2ced3ebf929/handlers.js#L55-L59 "Source code on GitHub")

Used as base class for most handlers
All extensions should implement method `_handle(record)`

## setFormat

[handlers.js:88-95](https://github.com/btd/huzzah/blob/f8c3bfd67f6149564a96e1b1f452b2ced3ebf929/handlers.js#L88-L95 "Source code on GitHub")

Set log record format for this handler.
Default record format is `[%date] %-5level %logger - %message%n%error`

Possible parameters:

-   `%d{FORMAT}` or `%date{FORMAT}` - how to format record timestamp. `{FORMAT}` is optional stftime string, by default it is `%Y/%m/%d %H:%M:%S,%L`
-   `%pid` - output process.pid
-   `%level` or `%le` or `%p` - output record level name like ERROR or WARN
-   `%logger` or `%lo` or `%c` - output logger name
-   `%%` - output %
-   `%n` - output EOL
-   `%err` or `%error` - output stack trace of passed error

Also available text decorators (now only colors):

-   `%highlight(text)` - will decorate passed text with record level decorator
-   `%cyan(text)`
-   other colors
-   `%cyan.bold(text)`
-   other bold colors

Example: `%date000 %highlight(%5level) %cyan(%logger) - %message%n%error`

**Parameters**

-   `format` **string or function** It is either formatted string as described, or function returning string and accepts just one argument log record

Returns **this** 

# ConsoleHandler

[handlers.js:102-104](https://github.com/btd/huzzah/blob/f8c3bfd67f6149564a96e1b1f452b2ced3ebf929/handlers.js#L102-L104 "Source code on GitHub")

Just simple console handler

# Logger

[logger.js:15-23](https://github.com/btd/huzzah/blob/f8c3bfd67f6149564a96e1b1f452b2ced3ebf929/logger.js#L15-L23 "Source code on GitHub")

Produce log records. It could not be create manuall,
always use LoggerFactory instance to create loggers.

**Parameters**

-   `factory` **LoggerFactory** factory, holding this logger
-   `name` **string** name of this logger
-   `context` **Object** Set of keys, which will be auto-added to each record

## debug

[logger.js:114-114](https://github.com/btd/huzzah/blob/f8c3bfd67f6149564a96e1b1f452b2ced3ebf929/logger.js#L114-L114 "Source code on GitHub")

Create log record with level DEBUG. If first argument is string, it is used as message format, like console.log do.
Supported modifiers %s, %d, %j, %%. If you want to output error, it must be one among all arguments and be last.

**Parameters**

-   `args` **...Any** Any arguments. Error must be one and last.

**Examples**

```javascript
logger.trace('User entered %s', userInput);

logger.error('Error happen while sending email', err);
```

## error

[logger.js:153-153](https://github.com/btd/huzzah/blob/f8c3bfd67f6149564a96e1b1f452b2ced3ebf929/logger.js#L153-L153 "Source code on GitHub")

Create log record with level ERROR. If first argument is string, it is used as message format, like console.log do.
Supported modifiers %s, %d, %j, %%. If you want to output error, it must be one among all arguments and be last.

**Parameters**

-   `args` **...Any** Any arguments. Error must be one and last.

**Examples**

```javascript
logger.trace('User entered %s', userInput);

logger.error('Error happen while sending email', err);
```

## info

[logger.js:127-127](https://github.com/btd/huzzah/blob/f8c3bfd67f6149564a96e1b1f452b2ced3ebf929/logger.js#L127-L127 "Source code on GitHub")

Create log record with level INFO. If first argument is string, it is used as message format, like console.log do.
Supported modifiers %s, %d, %j, %%. If you want to output error, it must be one among all arguments and be last.

**Parameters**

-   `args` **...Any** Any arguments. Error must be one and last.

**Examples**

```javascript
logger.trace('User entered %s', userInput);

logger.error('Error happen while sending email', err);
```

## trace

[logger.js:101-101](https://github.com/btd/huzzah/blob/f8c3bfd67f6149564a96e1b1f452b2ced3ebf929/logger.js#L101-L101 "Source code on GitHub")

Create log record with level TRACE. If first argument is string, it is used as message format, like console.log do.
Supported modifiers %s, %d, %j, %%. If you want to output error, it must be one among all arguments and be last.

**Parameters**

-   `args` **...Any** Any arguments. Error must be one and last.

**Examples**

```javascript
logger.trace('User entered %s', userInput);

logger.error('Error happen while sending email', err);
```

## warn

[logger.js:140-140](https://github.com/btd/huzzah/blob/f8c3bfd67f6149564a96e1b1f452b2ced3ebf929/logger.js#L140-L140 "Source code on GitHub")

Create log record with level WARN. If first argument is string, it is used as message format, like console.log do.
Supported modifiers %s, %d, %j, %%. If you want to output error, it must be one among all arguments and be last.

**Parameters**

-   `args` **...Any** Any arguments. Error must be one and last.

**Examples**

```javascript
logger.trace('User entered %s', userInput);

logger.error('Error happen while sending email', err);
```

## with

[logger.js:69-76](https://github.com/btd/huzzah/blob/f8c3bfd67f6149564a96e1b1f452b2ced3ebf929/logger.js#L69-L76 "Source code on GitHub")

Creates new Logger with the same name, factory but with given context.
Every property and value of context will be added to log record. This
can be usefull for json logging

**Parameters**

-   `context` **Object** 

Returns **Logger** new logger with given context

# LEVELS

[levels.js:6-14](https://github.com/btd/huzzah/blob/f8c3bfd67f6149564a96e1b1f452b2ced3ebf929/levels.js#L6-L14 "Source code on GitHub")

Log levels. Log levels have a priority.
ALL < TRACE < DEBUG < INFO < WARN < ERROR < OFF

# NullHandler

[handlers.js:11-13](https://github.com/btd/huzzah/blob/f8c3bfd67f6149564a96e1b1f452b2ced3ebf929/handlers.js#L11-L13 "Source code on GitHub")

Basic handler. Does not actually handle anything.
Usefull for extensions and stubs. All implementors must implement _handle(record)
method. record instance shared among all handlers, do not modify it.

## setLevel

[handlers.js:22-31](https://github.com/btd/huzzah/blob/f8c3bfd67f6149564a96e1b1f452b2ced3ebf929/handlers.js#L22-L31 "Source code on GitHub")

Set max accepted log level for this handler

**Parameters**

-   `level` **string** 

Returns **this** 

# StreamHandler

[handlers.js:123-129](https://github.com/btd/huzzah/blob/f8c3bfd67f6149564a96e1b1f452b2ced3ebf929/handlers.js#L123-L129 "Source code on GitHub")

Allow to pass records

**Parameters**

-   `stream` **WritableStream** Stream to write
-   `shouldFormat` **boolean** Should we format string to be text lines instead of objects

## setShouldFormat

[handlers.js:141-144](https://github.com/btd/huzzah/blob/f8c3bfd67f6149564a96e1b1f452b2ced3ebf929/handlers.js#L141-L144 "Source code on GitHub")

**Parameters**

-   `value` **boolean** 

Returns **this** 

## setStream

[handlers.js:150-153](https://github.com/btd/huzzah/blob/f8c3bfd67f6149564a96e1b1f452b2ced3ebf929/handlers.js#L150-L153 "Source code on GitHub")

**Parameters**

-   `stream` **WritableStream** 

Returns **this** 
