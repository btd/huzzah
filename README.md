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
huzzah.info h=1 text format x 1,129,416 ops/sec ±0.55% (89 runs sampled)
huzzah.info h=1 json format x 557,241 ops/sec ±1.41% (88 runs sampled)
huzzah.info h=0 text format x 2,231,541 ops/sec ±1.08% (91 runs sampled)
huzzah.info h=0 json format x 2,316,618 ops/sec ±1.10% (91 runs sampled)
winston.info x 37,611 ops/sec ±3.62% (79 runs sampled)
intel.info x 105,780 ops/sec ±0.49% (89 runs sampled)
bunyan.info x 82,470 ops/sec ±0.34% (91 runs sampled)
log4js.info x 77,328 ops/sec ±0.34% (87 runs sampled)
pino.info x 2,129,549 ops/sec ±0.87% (90 runs sampled)
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

require('huzzah')
  .settings('root')// see hierarchical section about what root mean
  .addHandler(new ConsoleHandler())
```

With code above all your loggers will output to console.

## Hierarchical loggers

All loggers have string names. We can create chain of loggers by separating its name with dots.
For example if we have logger with name `a.b.c` than its parents will be `a.b`, `a` and `root`.

That means you can configure some loggers and all nested loggers will reuse thier settings.

## How to use

1. Install

	`npm install --save huzzah`

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

	See API.md for more info.

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
	settings.setFormat('%date %msg%n');
	```

3. I want to produce JSON

	```js
	var jsonFormat = require('huzzah/json-format');
	settings.setFormat(jsonFormat());

	//jsonFormat can accept bunyan style serializers
	```

4. I want to add more fields to record (for JSON output)

	```js
	logger.with({ req, res }).info('Some message');
	```
