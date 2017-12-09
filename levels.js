"use strict";
/**
 * Log levels. Log levels have a priority.
 * ALL < TRACE < DEBUG < INFO < WARN < ERROR < OFF
 * @type {Object}
 */
const LEVELS = {
  ALL: 0,
  TRACE: 10,
  DEBUG: 20,
  INFO: 30,
  WARN: 40,
  ERROR: 50,
  OFF: 60
};

Object.keys(LEVELS).forEach(function(l) {
  LEVELS[LEVELS[l]] = l;
});

module.exports = LEVELS;
