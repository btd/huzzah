"use strict";

const parse = require("./parser");
const compile = require("./compiler");

const formatCache = {};

function createFormatFunction(text, tz) {
  const key = text + "|" + (tz || "");
  if (formatCache[key]) {
    return formatCache[key];
  }

  const nodes = parse(text);
  const result = compile(nodes, createFormatFunction.locale, createFormatFunction, tz);

  formatCache[key] = result;

  return result;
}

createFormatFunction.locale = {
  days: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
  shortDays: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
  months: [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
  ],
  shortMonths: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
  AM: "AM",
  PM: "PM",
  am: "am",
  pm: "pm",
  formats: {
    D: "%m/%d/%y",
    F: "%Y-%m-%d",
    R: "%H:%M",
    T: "%H:%M:%S",
    X: "%T",
    c: "%a %b %d %X %Y",
    r: "%I:%M:%S %p",
    v: "%e-%b-%Y",
    x: "%D"
  }
};

module.exports = createFormatFunction;

module.exports.isoFormat = compile.isoFormat;
