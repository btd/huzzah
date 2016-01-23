# LoggerSettings

[settings.js:10-14](https://github.com/btd/huzzah/blob/d730655861af1e78fdc76135eaafbb44b11288c3/settings.js#L10-L14 "Source code on GitHub")

Holds settings of one logger.
It is max accepted log level and handlers

## addHandler

[settings.js:41-44](https://github.com/btd/huzzah/blob/d730655861af1e78fdc76135eaafbb44b11288c3/settings.js#L41-L44 "Source code on GitHub")

Adds handler to logger

**Parameters**

-   `handler` **NullHandler** instance

Returns **this** 

## setLevel

[settings.js:29-29](https://github.com/btd/huzzah/blob/d730655861af1e78fdc76135eaafbb44b11288c3/settings.js#L29-L29 "Source code on GitHub")

Set max accepted log level. Default value ALL.
It means if you set log level for this logger to INFO, than
all lower leveled record will be rejected (e.g DEBUG and TRACE).
To completely disable all logs set to OFF

**Parameters**

-   `level` **string** 

Returns **this** 

# BaseHandler

[handlers.js:54-58](https://github.com/btd/huzzah/blob/d730655861af1e78fdc76135eaafbb44b11288c3/handlers.js#L54-L58 "Source code on GitHub")

Used as base class for most handlers
All extensions should implement method `_handle(record)`

## setFormat

[handlers.js:87-94](https://github.com/btd/huzzah/blob/d730655861af1e78fdc76135eaafbb44b11288c3/handlers.js#L87-L94 "Source code on GitHub")

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

[handlers.js:101-103](https://github.com/btd/huzzah/blob/d730655861af1e78fdc76135eaafbb44b11288c3/handlers.js#L101-L103 "Source code on GitHub")

Just simple console handler

# Logger

[logger.js:25-28](https://github.com/btd/huzzah/blob/d730655861af1e78fdc76135eaafbb44b11288c3/logger.js#L25-L28 "Source code on GitHub")

Produce log records. It could not be create manuall,
always use LoggerFactory instance to create loggers.

**Parameters**

-   `factory` **LoggerFactory** factory, holding this logger
-   `name` **string** name of this logger

## debug

[logger.js:69-69](https://github.com/btd/huzzah/blob/d730655861af1e78fdc76135eaafbb44b11288c3/logger.js#L69-L69 "Source code on GitHub")

Create log record with level debug

**Parameters**

-   `args` **...Any** Any arguments. Error must be one and last

## error

[logger.js:99-99](https://github.com/btd/huzzah/blob/d730655861af1e78fdc76135eaafbb44b11288c3/logger.js#L99-L99 "Source code on GitHub")

Create log record with level error

**Parameters**

-   `args` **...Any** Any arguments. Error must be one and last

## info

[logger.js:79-79](https://github.com/btd/huzzah/blob/d730655861af1e78fdc76135eaafbb44b11288c3/logger.js#L79-L79 "Source code on GitHub")

Create log record with level info

**Parameters**

-   `args` **...Any** Any arguments. Error must be one and last

## log

[logger.js:38-40](https://github.com/btd/huzzah/blob/d730655861af1e78fdc76135eaafbb44b11288c3/logger.js#L38-L40 "Source code on GitHub")

Create log record with given level and arguments.
Usually not used.

**Parameters**

-   `level` **number** Log level
-   `args` **Array** Arguments

## trace

[logger.js:59-59](https://github.com/btd/huzzah/blob/d730655861af1e78fdc76135eaafbb44b11288c3/logger.js#L59-L59 "Source code on GitHub")

Create log record with level trace

**Parameters**

-   `args` **...Any** Any arguments. Error must be one and last

## warn

[logger.js:89-89](https://github.com/btd/huzzah/blob/d730655861af1e78fdc76135eaafbb44b11288c3/logger.js#L89-L89 "Source code on GitHub")

Create log record with level warn

**Parameters**

-   `args` **...Any** Any arguments. Error must be one and last

# LoggerFactory

[factory.js:11-14](https://github.com/btd/huzzah/blob/d730655861af1e78fdc76135eaafbb44b11288c3/factory.js#L11-L14 "Source code on GitHub")

Handler logger and its settings manipulation

## get

[factory.js:23-26](https://github.com/btd/huzzah/blob/d730655861af1e78fdc76135eaafbb44b11288c3/factory.js#L23-L26 "Source code on GitHub")

Returns logger with given name

**Parameters**

-   `name` **string** Name of logger

Returns **Logger** 

## settings

[factory.js:61-64](https://github.com/btd/huzzah/blob/d730655861af1e78fdc76135eaafbb44b11288c3/factory.js#L61-L64 "Source code on GitHub")

Returns settings for logger with given name

**Parameters**

-   `name` **string** logger name

Returns **LoggerSettings** 

# LEVELS

[levels.js:8-16](https://github.com/btd/huzzah/blob/d730655861af1e78fdc76135eaafbb44b11288c3/levels.js#L8-L16 "Source code on GitHub")

Log levels. Log levels have a priority.
ALL < TRACE < DEBUG < INFO < WARN < ERROR < OFF

# NullHandler

[handlers.js:10-12](https://github.com/btd/huzzah/blob/d730655861af1e78fdc76135eaafbb44b11288c3/handlers.js#L10-L12 "Source code on GitHub")

Basic handler. Does not actually handle anything.
Usefull for extensions and stubs

## setLevel

[handlers.js:21-30](https://github.com/btd/huzzah/blob/d730655861af1e78fdc76135eaafbb44b11288c3/handlers.js#L21-L30 "Source code on GitHub")

Set max accepted log level for this handler

**Parameters**

-   `level` **string** 

Returns **this** 

# StreamHandler

[handlers.js:122-128](https://github.com/btd/huzzah/blob/d730655861af1e78fdc76135eaafbb44b11288c3/handlers.js#L122-L128 "Source code on GitHub")

Allow to pass records

**Parameters**

-   `stream` **WritableStream** Stream to write
-   `shouldFormat` **boolean** Should we format string to be text lines instead of objects

## setShouldFormat

[handlers.js:140-143](https://github.com/btd/huzzah/blob/d730655861af1e78fdc76135eaafbb44b11288c3/handlers.js#L140-L143 "Source code on GitHub")

**Parameters**

-   `value` **boolean** 

Returns **this** 

## setStream

[handlers.js:149-152](https://github.com/btd/huzzah/blob/d730655861af1e78fdc76135eaafbb44b11288c3/handlers.js#L149-L152 "Source code on GitHub")

**Parameters**

-   `stream` **WritableStream** 

Returns **this** 
