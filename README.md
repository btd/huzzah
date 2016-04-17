# Huzzah

[![Join the chat at https://gitter.im/btd/huzzah](https://badges.gitter.im/btd/huzzah.svg)](https://gitter.im/btd/huzzah?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

[![Build Status](https://travis-ci.org/btd/huzzah.svg?branch=master)](https://travis-ci.org/btd/huzzah)
[![Coverage Status](https://coveralls.io/repos/github/btd/huzzah/badge.svg?branch=master)](https://coveralls.io/github/btd/huzzah?branch=master)

You can finally say - Huzzah!!!

It is one of the fastest and dead simple hierarchical text logger.

Let step by step explain what does it mean.

## Fastest

```
$ node benchmark/logging.js
huzzah.info text format x 1,086,987 ops/sec ±0.43% (92 runs sampled)
huzzah.info json format x 511,541 ops/sec ±1.33% (86 runs sampled)
winston.info x 38,257 ops/sec ±3.51% (81 runs sampled)
intel.info x 100,880 ops/sec ±1.43% (85 runs sampled)
bunyan.info x 82,518 ops/sec ±0.56% (92 runs sampled)
log4js.info x 84,119 ops/sec ±0.31% (92 runs sampled)
pino.info x 911,255 ops/sec ±0.85% (89 runs sampled)
```

## Dead simple

In usage:

```js
var logger = require('huzzah').get('some_logger');

logger.trace('Some error can happen %s', 'argument');
```

But we still need some configuration what and where to output:
```js

var ConsoleHandler = require('huzzah/handlers').ConsoleHandler;

// require("huzzah") returns default logger factory instance
// which contains loggers and their settings
require('huzzah')
  // get settings of logger with name 'root'
  .settings('root')// see hierarchical section about what root mean (it is parent of all loggers)
  // output every log message to console, from all loggers (.addHandler call can be chained)
  .addHandler(new ConsoleHandler())
```

## Hierarchical loggers

All loggers have string names. We can create chain of loggers by separating its name with dots.
For example if we have logger with name `a.b.c` than its parents will be `a.b`, `a` and `root`.

That means you can configure some parent loggers and all nested loggers will reuse thier settings.
In simple case you can configure only **root** logger as single configuration point.

## How to use

1. Install

	```
	npm install --save huzzah
	```

2. Configure

	```js
	var huzzah = require('huzzah');

	// get settings of some loggers
	var settingsOfRootLogger = huzzah.settings('root');

	settingsOfRootLogger
		// let add console handler
		.addHandler(new ConsoleHandler())
		// let add output to file
		.addHandler(new StreamHandler().setStream(fs.createWriteStream('debug.log')))

	```

	See [API.md](https://github.com/btd/huzzah/edit/master/API.md) for more info.

3. Use

	```js
	var logger = require('huzzah').get('some_logger');

	logger.error('Some error happen', err);
	```

## FAQ

1. I need logger to reject all records with log level < INFO.

	  ```js
	  // settings it is LoggerSettings (what is returned by LoggerFactory#settings)
	  settings.setLevel('INFO');
	  ```

2. I want my own format of records

	  ```js
	  handler.setFormat('%date %msg%n');
	  ```

3. I want to produce JSON

	  ```js
	  var jsonFormat = require('huzzah/json-format');
	  handler.setFormat(jsonFormat());
	
	  //jsonFormat can accept bunyan style serializers
	  ```

4. I want to add more fields to record (for JSON output)

	  ```js
	  logger.with({ req, res }).info('Some message');
	  ```
	  
	  With such way you can use it with express like:
	  ```
	  app.use((req, res, next) => {
	    req.logger = logger.with({ req, res, req_id: uuid() });
	  });
	  ```
	  And use req.logger to output additional context information. 

# license

MIT
