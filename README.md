# Huzzah

[![Join the chat at https://gitter.im/btd/huzzah](https://badges.gitter.im/btd/huzzah.svg)](https://gitter.im/btd/huzzah?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

[![Build Status](https://travis-ci.org/btd/huzzah.svg?branch=master)](https://travis-ci.org/btd/huzzah)
[![Coverage Status](https://coveralls.io/repos/github/btd/huzzah/badge.svg?branch=master)](https://coveralls.io/github/btd/huzzah?branch=master)

You can finally say - Huzzah!!!

It is the fastest and dead simple hierarchical text logger.

Let step by step explain what does it mean.

## Fastest

```
$ node benchmark/logging.js
huzzah.info text format x 856,021 ops/sec ±0.46% (89 runs sampled)
huzzah.info json format x 336,543 ops/sec ±1.34% (87 runs sampled)
winston.info x 38,553 ops/sec ±2.99% (79 runs sampled)
intel.info x 106,594 ops/sec ±0.48% (87 runs sampled)
bunyan.info x 79,778 ops/sec ±0.31% (90 runs sampled)
log4js.info x 49,651 ops/sec ±0.41% (86 runs sampled)
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
		.addHandler(new StreamHandler(fs.createWriteStream('debug.log')))

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
	logger.with({ req: req, res: res }).info('Some message');
	```
