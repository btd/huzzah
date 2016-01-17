# LoggerSettings

[settings.js:10-14](https://github.com/btd/huzzah/blob/e356abdac0208b6aa8783e4c4f02bd234527ad2b/settings.js#L10-L14 "Source code on GitHub")

Holds settings of one logger.
It is max accepted log level and handlers

## addHandler

[settings.js:41-44](https://github.com/btd/huzzah/blob/e356abdac0208b6aa8783e4c4f02bd234527ad2b/settings.js#L41-L44 "Source code on GitHub")

Adds handler to logger

**Parameters**

-   `handler` **NullHandler** instance

Returns **this** 

## setLevel

[settings.js:29-29](https://github.com/btd/huzzah/blob/e356abdac0208b6aa8783e4c4f02bd234527ad2b/settings.js#L29-L29 "Source code on GitHub")

Set max accepted log level. Default value ALL.
It means if you set log level for this logger to INFO, than
all lower leveled record will be rejected (e.g DEBUG and TRACE).
To completely disable all logs set to OFF

**Parameters**

-   `level` **string** 

Returns **this** 

# BaseHandler

[handlers.js:54-58](https://github.com/btd/huzzah/blob/e356abdac0208b6aa8783e4c4f02bd234527ad2b/handlers.js#L54-L58 "Source code on GitHub")

Used as base class for most handlers
All extensions should implement method `_handle(record)`

## setFormat

[handlers.js:68-75](https://github.com/btd/huzzah/blob/e356abdac0208b6aa8783e4c4f02bd234527ad2b/handlers.js#L68-L75 "Source code on GitHub")

Set log record format for this handler.
Default record format is `[%date] %-5level %logger - %message%n%error`

**Parameters**

-   `format` **string or function** 

Returns **this** 

# ConsoleHandler

[handlers.js:83-87](https://github.com/btd/huzzah/blob/e356abdac0208b6aa8783e4c4f02bd234527ad2b/handlers.js#L83-L87 "Source code on GitHub")

Just simple console handler

**Parameters**

-   `colorize` **boolean** Do we need to produce shiny colored log record

# Logger

[logger.js:25-28](https://github.com/btd/huzzah/blob/e356abdac0208b6aa8783e4c4f02bd234527ad2b/logger.js#L25-L28 "Source code on GitHub")

Produce log records. It could not be create manuall,
always use LoggerFactory instance to create loggers.

**Parameters**

-   `factory` **LoggerFactory** factory, holding this logger
-   `name` **string** name of this logger

## debug

[logger.js:67-67](https://github.com/btd/huzzah/blob/e356abdac0208b6aa8783e4c4f02bd234527ad2b/logger.js#L67-L67 "Source code on GitHub")

Create log record with level debug

## error

[logger.js:94-94](https://github.com/btd/huzzah/blob/e356abdac0208b6aa8783e4c4f02bd234527ad2b/logger.js#L94-L94 "Source code on GitHub")

Create log record with level error

## info

[logger.js:76-76](https://github.com/btd/huzzah/blob/e356abdac0208b6aa8783e4c4f02bd234527ad2b/logger.js#L76-L76 "Source code on GitHub")

Create log record with level info

## log

[logger.js:38-40](https://github.com/btd/huzzah/blob/e356abdac0208b6aa8783e4c4f02bd234527ad2b/logger.js#L38-L40 "Source code on GitHub")

Create log record with given level and arguments.
Usually not used.

**Parameters**

-   `level` **number** Log level
-   `args` **Array** Arguments

## trace

[logger.js:58-58](https://github.com/btd/huzzah/blob/e356abdac0208b6aa8783e4c4f02bd234527ad2b/logger.js#L58-L58 "Source code on GitHub")

Create log record with level trace

## warn

[logger.js:85-85](https://github.com/btd/huzzah/blob/e356abdac0208b6aa8783e4c4f02bd234527ad2b/logger.js#L85-L85 "Source code on GitHub")

Create log record with level warn

# LoggerFactory

[factory.js:11-14](https://github.com/btd/huzzah/blob/e356abdac0208b6aa8783e4c4f02bd234527ad2b/factory.js#L11-L14 "Source code on GitHub")

Handler logger and its settings manipulation

## get

[factory.js:23-26](https://github.com/btd/huzzah/blob/e356abdac0208b6aa8783e4c4f02bd234527ad2b/factory.js#L23-L26 "Source code on GitHub")

Returns logger with given name

**Parameters**

-   `name` **string** Name of logger

Returns **Logger** 

## settings

[factory.js:61-64](https://github.com/btd/huzzah/blob/e356abdac0208b6aa8783e4c4f02bd234527ad2b/factory.js#L61-L64 "Source code on GitHub")

Returns settings for logger with given name

**Parameters**

-   `name` **string** logger name

Returns **LoggerSettings** 

# LEVELS

[levels.js:8-16](https://github.com/btd/huzzah/blob/e356abdac0208b6aa8783e4c4f02bd234527ad2b/levels.js#L8-L16 "Source code on GitHub")

Log levels. Log levels have a priority.
ALL < TRACE < DEBUG < INFO < WARN < ERROR < OFF

# NullHandler

[handlers.js:10-12](https://github.com/btd/huzzah/blob/e356abdac0208b6aa8783e4c4f02bd234527ad2b/handlers.js#L10-L12 "Source code on GitHub")

Basic handler. Does not actually handle anything.
Usefull for extensions and stubs

## setLevel

[handlers.js:21-30](https://github.com/btd/huzzah/blob/e356abdac0208b6aa8783e4c4f02bd234527ad2b/handlers.js#L21-L30 "Source code on GitHub")

Set max accepted log level for this handler

**Parameters**

-   `level` **string** 

Returns **this** 

# StreamHandler

[handlers.js:120-126](https://github.com/btd/huzzah/blob/e356abdac0208b6aa8783e4c4f02bd234527ad2b/handlers.js#L120-L126 "Source code on GitHub")

Allow to pass records

**Parameters**

-   `stream` **WritableStream** Stream to write
-   `shouldFormat` **boolean** Should we format string to be text lines instead of objects

## setShouldFormat

[handlers.js:138-141](https://github.com/btd/huzzah/blob/e356abdac0208b6aa8783e4c4f02bd234527ad2b/handlers.js#L138-L141 "Source code on GitHub")

**Parameters**

-   `value` **boolean** 

Returns **this** 

## setStream

[handlers.js:147-150](https://github.com/btd/huzzah/blob/e356abdac0208b6aa8783e4c4f02bd234527ad2b/handlers.js#L147-L150 "Source code on GitHub")

**Parameters**

-   `stream` **WritableStream** 

Returns **this** 
