# Huzzah

You can finally say - Huzzah!!!

It is the fastest and dead simple hierarchical text logger.

Let step by step explain what does it mean.

## Fastest

```
$ node benchmark/logging.js
huzzah.info text format x 785,441 ops/sec ±0.45% (91 runs sampled)
huzzah.info json format x 110,536 ops/sec ±0.66% (90 runs sampled)
winston.info x 38,381 ops/sec ±3.46% (78 runs sampled)
intel.info x 105,463 ops/sec ±0.53% (87 runs sampled)
bunyan.info x 78,780 ops/sec ±0.29% (92 runs sampled)
log4js.info x 48,364 ops/sec ±0.33% (90 runs sampled)
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
