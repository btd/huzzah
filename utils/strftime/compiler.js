"use strict";

const EOL = "\n";
const quote = require("../quote");

function padZero3(n) {
  if (n >= 0 && n < 10) {
    return "00" + n;
  } else if (n >= 10 && n < 100) {
    return "0" + n;
  } else {
    return String(n);
  }
}

function pad2(n, padding) {
  if (n >= 0 && n < 10) {
    return padding + n;
  } else {
    return String(n);
  }
}

function weekNumber(d, firstWeekday, tz) {
  firstWeekday = firstWeekday || "sunday";

  // This works by shifting the weekday back by one day if we
  // are treating Monday as the first day of the week.
  let wday = d["get" + tz + "Day"]();
  if (firstWeekday === "monday") {
    if (wday === 0) {
      // Sunday
      wday = 6;
    } else {
      wday--;
    }
  }
  const firstDayOfYear = new Date(d["get" + tz + "FullYear"](), 0, 1);
  const yday = (d - firstDayOfYear) / 86400000;
  const weekNum = (yday + 7 - wday) / 7;

  return Math.floor(weekNum);
}

function hours12(d, tz) {
  let hour = d["get" + tz + "Hours"]();
  if (hour === 0) {
    hour = 12;
  } else if (hour > 12) {
    hour -= 12;
  }
  return hour;
}

let timestampIndex = 0;

module.exports = function compile(nodes, locale, compileFormatter, _tz) {
  const tz = _tz === "UTC" ? _tz : "";
  let source = "";
  const dateFormats = [];
  const argumentKeys = ["l", "pad2", "padZero3", "hours12", "weekNumber"];
  const argumentValues = [locale, pad2, padZero3, hours12, weekNumber];

  function preCompileFormat(format) {
    const name = "preCompiledTimestamp" + timestampIndex++;
    argumentKeys.push(name);
    argumentValues.push(compileFormatter(format));
    return name;
  }

  function writeLine(code) {
    source += "__p += " + code + ";\n";
  }

  function write(code) {
    source += code;
  }

  function processNodes(nodes) {
    nodes.forEach(function(node) {
      let padding = "0";
      switch (node.type) {
        case "const":
          return writeLine(quote(node.v));

        case "var":
          write("__p += ");
          padding = node.pad === "-" ? "" : node.pad === "_" ? " " : "0"; // by default it is 0

          switch (node.name) {
            case "A": //Full weekday name *
              write("__l.days[d.get" + tz + "Day()]");
              break;

            case "a": //Abbreviated weekday name *
              write("__l.shortDays[d.get" + tz + "Day()]");
              break;

            case "B": //Full month name *
              write("__l.months[d.get" + tz + "Month()]");
              break;

            case "b": //Abbreviated month name *
              write("__l.shortMonths[d.get" + tz + "Month()]");
              break;

            case "c": //Date and time representation *
              write("__" + preCompileFormat(locale.formats.c) + "(d)");
              break;

            case "C": //Year divided by 100 and truncated to integer (00-99)
              write("__pad2(Math.floor(d.get" + tz + 'FullYear() / 100), "' + padding + '")');
              break;

            case "D":
              write("__" + preCompileFormat(locale.formats.D) + "(d)");
              break;

            case "d": //Day of the month, zero-padded (01-31)
              write("__pad2(d.get" + tz + 'Date(), "' + padding + '")');
              break;

            case "e": // Day of the month, space-padded ( 1-31)
              write("__pad2(d.get" + tz + 'Date(), " ")');
              break;

            case "F":
              write("__" + preCompileFormat(locale.formats.F) + "(d)");
              break;

            case "H": //Hour in 24h format (00-23)
              write("__pad2(d.get" + tz + 'Hours(), "' + padding + '")');
              break;

            case "h": //Abbreviated month name * (same as %b)
              write("__l.shortMonths[d.get" + tz + "Month()]");
              break;

            case "I": //Hour in 12h format (01-12)
              write("__pad2(__hours12(d, " + quote(tz) + '), "' + padding + '")');
              break;

            case "j": //Day of the year (001-366)
              write(
                "__padZero3(Math.ceil((d.getTime() " +
                  "- (new Date(d.get" +
                  tz +
                  "FullYear(), 0, 1)).getTime()) / (1000*60*60*24)))"
              );
              break;

            case "k":
              write("__pad2(d.get" + tz + 'Hours(), "' + padding + '")');
              break;

            case "L":
              write("__padZero3(d.get" + tz + "Milliseconds())");
              break;

            case "l":
              write("__pad2(__hours12(d, " + quote(tz) + '), "' + padding + '")');
              break;

            case "M":
              write("__pad2(d.get" + tz + 'Minutes(), "' + padding + '")');
              break;

            case "m":
              write("__pad2(d.get" + tz + 'Month() + 1, "' + padding + '")');
              break;

            case "n":
              write(quote(EOL));
              break;

            case "P":
              write("(d.get" + tz + "Hours() < 12 ? __l.am : __l.pm)");
              break;

            case "p":
              write("(d.get" + tz + "Hours() < 12 ? __l.AM : __l.PM)");
              break;

            case "R":
              write("__" + preCompileFormat(locale.formats.R) + "(d)");
              break;

            case "r":
              write("__" + preCompileFormat(locale.formats.r) + "(d)");
              break;

            case "S":
              write("__pad2(d.get" + tz + 'Seconds(), "' + padding + '")');
              break;

            case "s":
              write("Math.floor((d.getTime()) / 1000)");
              break;

            case "T":
              write("__" + preCompileFormat(locale.formats.T) + "(d)");
              break;

            case "U":
              write('__pad2(__weekNumber(d, "sunday", ' + quote(tz) + '), "' + padding + '")');
              break;

            case "u": // 1 - 7, Monday is first day of the week
              write("((__d = d.get" + tz + "Day()) === 0 ? 7 : __d)");
              break;

            case "v":
              write("__" + preCompileFormat(locale.formats.v) + "(d)");
              break;

            case "W":
              write('__pad2(__weekNumber(d, "monday", ' + quote(tz) + '), "' + padding + '")');
              break;

            case "w":
              write("d.get" + tz + "Day()"); // 0 - 6, Sunday is first day of the week
              break;

            case "X":
              write("__" + preCompileFormat(locale.formats.X) + "(d)");
              break;

            case "x":
              write("__" + preCompileFormat(locale.formats.x) + "(d)");
              break;

            case "Y":
              write("d.get" + tz + "FullYear()");
              break;

            case "y":
              write("__pad2(d.get" + tz + 'FullYear() % 100, "' + padding + '")');
              break;

            case "Z":
              write("((__d = d.toString().match(/\\((\\w+)\\)/)) " + '&& __d[1] || "" )');
              break;

            case "z":
              write(
                '(((__d = d.getTimezoneOffset()) < 0 ? "+" : "-") ' +
                  '+ __pad2(Math.abs(__d / 60), "0") + __pad2(__d % 60, "0"))'
              );
              break;

            default:
              throw new Error("Strftime format node variable not supported: %" + node.name);
          }

          write(";\n");
          return;
      }
    });
  }

  processNodes(nodes);

  source =
    "function(t) {\n" +
    "var d = new Date(t);\n" +
    "var " +
    argumentKeys
      .map(function(a) {
        return "__" + a + " = " + a;
      })
      .join(", ") +
    ", __d, __p = '';\n" +
    source +
    "return __p;\n}";

  const result = Function(argumentKeys, "return " + source).apply(undefined, argumentValues.concat(dateFormats));

  result.source = source;

  return result;
};

module.exports.isoFormat = function(t) {
  const d = new Date(t);
  const __pad2 = pad2,
    __padZero3 = padZero3;
  let __p = "";
  __p += d.getUTCFullYear();
  __p += "-";
  __p += __pad2(d.getUTCMonth() + 1, "0");
  __p += "-";
  __p += __pad2(d.getUTCDate(), "0");
  __p += "T";
  __p += __pad2(d.getUTCHours(), "0");
  __p += ":";
  __p += __pad2(d.getUTCMinutes(), "0");
  __p += ":";
  __p += __pad2(d.getUTCSeconds(), "0");
  __p += ".";
  __p += __padZero3(d.getUTCMilliseconds());
  __p += "Z";
  return __p;
};
