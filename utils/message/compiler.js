var EOL = "\n";
var quote = require("../quote");
var LEVELS = require("../../levels");
var stringify = require("../safe-json-stringify");

var compileTimestamp = require("../strftime");

var spacePadding = new Array(1000).join(" ");

function pad(str, value) {
  if (str.length >= Math.abs(value)) return str;

  var isRight = false;

  if (value < 0) {
    isRight = true;
    value = -value;
  }

  if (str.length < value) {
    var padding = spacePadding.slice(0, value - str.length);
    return isRight ? str + padding : padding + str;
  } else {
    return str;
  }
}

function trunc(str, value) {
  if (str.length <= Math.abs(value)) return str;

  if (value > 0) {
    // truncate from begining
    return str.substring(str.length - value);
  } else {
    // truncate from end
    return str.substring(0, -value);
  }
}

function formatError(err) {
  var parts = err.stack ? err.stack.split("\n") : [];
  var res = "";
  for (var i = 0, l = parts.length; i < l; i++) {
    res += "  " + parts[i] + EOL;
  }
  return res;
}

function decorator(code) {
  return ["\u001b[" + code + "m", "\u001b[0;39m"];
}

var DECORATOR = {
  black: decorator(30),
  red: decorator(31),
  green: decorator(32),
  yellow: decorator(33),
  blue: decorator(34),
  magenta: decorator(35),
  cyan: decorator(36),
  white: decorator(37),

  "black.bold": decorator("1;" + 30),
  "red.bold": decorator("1;" + 31),
  "green.bold": decorator("1;" + 32),
  "yellow.bold": decorator("1;" + 33),
  "blue.bold": decorator("1;" + 34),
  "magenta.bold": decorator("1;" + 35),
  "cyan.bold": decorator("1;" + 36),
  "white.bold": decorator("1;" + 37)
};

var DEFAULT_DATE_FORMAT = "%Y/%m/%d %H:%M:%S,%L";

var LEVEL_DECORATORS = {};
LEVEL_DECORATORS[LEVELS.ERROR] = DECORATOR["red.bold"];
LEVEL_DECORATORS[LEVELS.WARN] = DECORATOR["yellow"];
LEVEL_DECORATORS[LEVELS.INFO] = DECORATOR["blue"];
LEVEL_DECORATORS[LEVELS.DEBUG] = ["", ""];
LEVEL_DECORATORS[LEVELS.TRACE] = ["", ""];

module.exports = function compile(onodes) {
  var source = "";
  var dateFormats = [];
  var argumentKeys = [
    "trunc",
    "pad",
    "formatError",
    "LEVEL_DECORATORS",
    "stringify"
  ];
  var argumentValues = [trunc, pad, formatError, LEVEL_DECORATORS, stringify];

  function writeLine(code) {
    source += "__p += " + code + ";\n";
  }

  function write(code) {
    source += code;
  }

  function processNodes(nodes) {
    nodes.forEach(function(node) {
      var _name;

      switch (node.type) {
        case "const":
          return writeLine(quote(node.v));

        case "var":
          write("__p += ");
          if (node.pad != null) {
            write("__pad(");
          }

          if (node.trunc != null) {
            write("__trunc(");
          }

          switch (node.name) {
            case "c":
            case "lo":
            case "logger":
              write("rec.name");
              break;

            case "p":
            case "le":
            case "level":
              write("rec.levelname");
              break;

            case "pid":
              write("rec.pid");
              break;

            case "m":
            case "msg":
            case "message":
              write("rec.message");
              break;

            case "n":
              write(quote(EOL));
              break;

            case "err":
            case "error":
              write('(rec.err ? __formatError(rec.err): "")');
              break;

            case "d":
            case "date":
              _name = "dateFormat" + dateFormats.length;
              argumentKeys.push(_name);

              dateFormats.push(
                compileTimestamp(
                  node.args[0] || DEFAULT_DATE_FORMAT,
                  node.args[1]
                )
              );
              write("__" + _name + "(rec.timestamp)");
              break;

            case "x":
              _name = "rec.context";
              if (node.args.length) {
                _name += "[" + quote(node.args[0]) + "]";
              }
              write("(rec.context ? __stringify(" + _name + '): "")');

              break;

            default:
              throw new Error(
                "Message format node variable not supported: " + node.name
              );
          }

          if (node.trunc != null) {
            write("," + node.trunc + ")");
          }

          if (node.pad != null) {
            write("," + node.pad + ")");
          }
          write(";\n");
          return;

        case "decorator":
          if (node.name === "highlight") {
            writeLine("__LEVEL_DECORATORS[rec.level][0]");
          } else if (DECORATOR[node.name]) {
            writeLine(quote(DECORATOR[node.name][0]));
          } else {
            throw new Error(
              "Message format node decorator not supported: " + node.name
            );
          }

          processNodes(node.nodes);

          if (node.name === "highlight") {
            writeLine("__LEVEL_DECORATORS[rec.level][1]");
          } else if (DECORATOR[node.name]) {
            writeLine(quote(DECORATOR[node.name][1]));
          }
      }
    });
  }

  processNodes(onodes);

  source =
    "function(rec) {\n" +
    "var " +
    argumentKeys
      .map(function(a) {
        return "__" + a + " = " + a;
      })
      .join(", ") +
    ", __p = '';\n" +
    source +
    "return __p;\n}";
  var result;

  result = Function(argumentKeys, "return " + source).apply(
    undefined,
    argumentValues.concat(dateFormats)
  );

  result.source = source;

  return result;
};
