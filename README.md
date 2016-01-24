# Huzzah

You can finally say - Huzzah!!!

It is the fastest and dead simple hierarchical text logger.

Let step by step explain what does it mean.

## Fastest

```
$ node benchmark/logging.js
console.info x 3,798,029 ops/sec ±2.62% (92 runs sampled)
huzzah.info x 511,637 ops/sec ±1.32% (91 runs sampled)
winston.info x 40,114 ops/sec ±3.59% (80 runs sampled)
intel.info x 113,133 ops/sec ±0.32% (90 runs sampled)
bunyan.info x 85,245 ops/sec ±0.26% (92 runs sampled)
log4js.info x 48,655 ops/sec ±0.24% (91 runs sampled)
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
