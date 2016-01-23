//based on https://github.com/samsonjs/strftime/blob/master/strftime.js
var EOL = require('os').EOL;

var DefaultLocale = {
  days: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  shortDays: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  shortMonths: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  AM: 'AM',
  PM: 'PM',
  am: 'am',
  pm: 'pm',
  formats: {
    D: '%m/%d/%y',
    F: '%Y-%m-%d',
    R: '%H:%M',
    T: '%H:%M:%S',
    X: '%T',
    c: '%a %b %d %X %Y',
    r: '%I:%M:%S %p',
    v: '%e-%b-%Y',
    x: '%D'
  }
};

function cacheBack(arr) {
  var obj = {};
  arr.forEach(function(el, idx) {
    obj[el] = idx;
  });
  return obj;
}

DefaultLocale.back = {
  days: cacheBack(DefaultLocale.days),
  shortDays: cacheBack(DefaultLocale.shortDays),
  months: cacheBack(DefaultLocale.months),
  shortMonths: cacheBack(DefaultLocale.shortMonths)
};

/* Used to match unescaped characters in compiled string literals */
var reUnescapedString = /['\n\r\t\u2028\u2029\\]/g;

var stringEscapes = {
  '\\': '\\',
  "'": "'",
  '\n': 'n',
  '\r': 'r',
  '\t': 't',
  '\u2028': 'u2028',
  '\u2029': 'u2029'
};

function escapeStringChar(match) {
  return '\\' + stringEscapes[match];
}

/*
 Used with numbers that have 3 digits
 */
function padZero3(n) {
  if (n >= 0 && n < 10) {
    return '00' + n;
  } else if (n >= 10 && n < 100) {
    return '0' + n;
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


function weekNumber(d, firstWeekday) {
  firstWeekday = firstWeekday || 'sunday';

  // This works by shifting the weekday back by one day if we
  // are treating Monday as the first day of the week.
  var wday = d.getDay();
  if (firstWeekday === 'monday') {
    if (wday === 0) {// Sunday
      wday = 6;
    } else {
      wday--;
    }
  }
  var firstDayOfYear = new Date(d.getFullYear(), 0, 1),
    yday = (d - firstDayOfYear) / 86400000,
    weekNum = (yday + 7 - wday) / 7;
  return Math.floor(weekNum);
}

function hours12(d) {
  var hour = d.getHours();
  if (hour === 0) {
    hour = 12;
  } else if (hour > 12) {
    hour -= 12;
  }
  return hour;
}

var RE = /%([-_0])?([a-zA-Z%])/g;

var timestampIndex = 0;

var formatersCache = {};

module.exports.formatter = function compileFormatter(format) {
  if (formatersCache[format]) {
    return formatersCache[format];
  }

  var source = "__p += '", index = 0,
    argumentKeys = ['l', 'pad2', 'padZero3', 'hours12', 'weekNumber'],
    argumentValues = [DefaultLocale, pad2, padZero3, hours12, weekNumber];

  function preCompileFormat(format) {
    var name = 'preCompiledTimestamp' + (timestampIndex++);
    argumentKeys.push(name);
    argumentValues.push(compileFormatter(format));
    return name;
  }

  // Most of the specifiers supported by C's strftime, and some from Ruby.
  // Some other syntax extensions from Ruby are supported: %-, %_, and %0
  // to pad with nothing, space, or zero (respectively).

  format.replace(RE, function (_, mod, c, offset) {
    var padding = mod === '-' ? ''
      : mod === '_' ? ' '
      : '0'; // by default it is 0

    source += format.slice(index, offset)
      .replace(reUnescapedString, escapeStringChar);

    var replaceVal = '';

    switch (c) {
      case '%':
        replaceVal = "'%'";
        break;

      case 'A': //Full weekday name *
        replaceVal = '__l.days[d.getDay()]';
        break;

      case 'a': //Abbreviated weekday name *
        replaceVal = '__l.shortDays[d.getDay()]';
        break;

      case 'B': //Full month name *
        replaceVal = '__l.months[d.getMonth()]';
        break;

      case 'b': //Abbreviated month name *
        replaceVal = '__l.shortMonths[d.getMonth()]';
        break;

      case 'c': //Date and time representation *
        replaceVal = '__'+preCompileFormat('%a %b %d %Y %H:%M:%S GMT%z (%Z)')+'(d)';
        break;

      case 'C': //Year divided by 100 and truncated to integer (00-99)
        replaceVal = '__pad2(Math.floor(d.getFullYear() / 100), "' + padding + '")';
        break;

      case 'D':
        replaceVal = '__'+preCompileFormat('%m/%d/%y')+'(d)';
        break;

      case 'd': //Day of the month, zero-padded (01-31)
        replaceVal = '__pad2(d.getDate(), "' + padding + '")';
        break;

      case 'e': // Day of the month, space-padded ( 1-31)
        replaceVal = '__pad2(d.getDate(), " ")';
        break;

      case 'F':
        replaceVal = '__'+preCompileFormat('%Y-%m-%d')+'(d)';
        break;

      case 'H': //Hour in 24h format (00-23)
        replaceVal = '__pad2(d.getHours(), "' + padding + '")';
        break;

      case 'h': //Abbreviated month name * (same as %b)
        replaceVal = '__l.shortMonths[d.getMonth()]';
        break;

      case 'I': //Hour in 12h format (01-12)
        replaceVal = '__pad2(__hours12(d), "' + padding + '")';
        break;

      case 'j': //Day of the year (001-366)
        replaceVal = '__padZero3(Math.ceil((d.getTime() ' +
          '- (new Date(d.getFullYear(), 0, 1)).getTime()) / (1000*60*60*24)))';
        break;

      case 'k':
        replaceVal = '__pad2(d.getHours(), "' + padding + '")';
        break;

      case 'L':
        replaceVal = '__padZero3(Math.floor(d.getTime() % 1000))';
        break;

      case 'l':
        replaceVal = '__pad2(__hours12(d), "' + padding + '")';
        break;

      case 'M':
        replaceVal = '__pad2(d.getMinutes(), "' + padding + '")';
        break;

      case 'm':
        replaceVal = '__pad2(d.getMonth() + 1, "' + padding + '")';
        break;

      case 'n':
        replaceVal = "'" + EOL.replace(reUnescapedString, escapeStringChar) + "'";
        break;

      //case 'o': return String(d.getDate()) + ordinal(d.getDate());
      case 'P':
        replaceVal = '(d.getHours() < 12 ? __l.am : __l.pm)';
        break;

      case 'p':
        replaceVal = '(d.getHours() < 12 ? __l.AM : __l.PM)';
        break;

      case 'R':
        replaceVal = '__'+preCompileFormat('%H:%M')+'(d)';
        break;

      case 'r':
        replaceVal = '__'+preCompileFormat('%I:%M:%S %p')+'(d)';
        break;

      case 'S':
        replaceVal = '__pad2(d.getSeconds(), "' + padding + '")';
        break;

      case 's':
        replaceVal = 'Math.floor((d.getTime()) / 1000)';
        break;

      case 'T':
        replaceVal = '__'+preCompileFormat('%H:%M:%S')+'(d)';
        break;

      case 't':
        replaceVal = "'\\t'";
        break;

      case 'U':
        replaceVal = '__pad2(__weekNumber(d, "sunday"), "' + padding + '")';
        break;

      case 'u': // 1 - 7, Monday is first day of the week
        replaceVal = '((__d = d.getDay()) === 0 ? 7 : __d)';
        break;

      case 'v':
        replaceVal = '__'+preCompileFormat('%e-%b-%Y')+'(d)';
        break;

      case 'W':
        replaceVal = '__pad2(__weekNumber(d, "monday"), "' + padding + '")';
        break;

      case 'w':
        replaceVal = 'd.getDay()'; // 0 - 6, Sunday is first day of the week
        break;

      case 'Y':
        replaceVal = 'd.getFullYear()';
        break;

      case 'y':
        replaceVal = 'String(d.getFullYear() % 100)';
        break;

      case 'Z':
        replaceVal = '((__d = d.toString().match(/\\((\\w+)\\)/)) ' +
          '&& __d[1] || "" )';
        break;

      case 'z':
        replaceVal = '(((__d = d.getTimezoneOffset()) < 0 ? "+" : "-") ' +
          '+ __pad2(Math.abs(__d / 60), "0") + __pad2(__d % 60, "0"))';
        break;

      default:
        throw new Error('%' + c + ' strftime format not supported');
    }

    source += "' +\n" + replaceVal + " +\n'";

    index = offset + _.length;

    return _;
  });

  source += format.substr(index).replace(reUnescapedString, escapeStringChar) + "';\n";

  // frame code as the function body
  source = 'function(d) {\n' +
    "var " + argumentKeys.map(function(a) {
    return '__' + a + ' = ' + a;
  }).join(', ') + ", __d, __p = '';\n" +
    source +
    'return __p;\n}';

  var result;
  try {
    result = Function(argumentKeys, 'return ' + source)
      .apply(undefined, argumentValues);
  } catch (e) {
    e.source = source;
    throw e;
  }

  result.source = source;
  formatersCache[format] = result;
  return result;
};
