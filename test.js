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

var formats = {
  Y: new Intl.DateTimeFormat([ 'en-US' ], { timeZone: 'UTC', year: 'numeric' }),
  m: new Intl.DateTimeFormat([ 'en-US' ], { timeZone: 'UTC', month: '2-digit' }),
  d: new Intl.DateTimeFormat([ 'en-US' ], { timeZone: 'UTC', day: '2-digit' }),

  H: new Intl.DateTimeFormat([ 'en-US' ], { timeZone: 'UTC', hour: '2-digit' }),
  M: new Intl.DateTimeFormat([ 'en-US' ], { timeZone: 'UTC', minute: '2-digit' }),
  S: new Intl.DateTimeFormat([ 'en-US' ], { timeZone: 'UTC', second: '2-digit' }),
}

//%Y/%m/%d %H:%M:%S,%L

function v1(d) {
  var __pad2 = pad2, __padZero3 = padZero3, __p = '';
  __p += d.getUTCFullYear();
  __p += '/';
  __p += __pad2(d.getUTCMonth() + 1, "0");
  __p += '/';
  __p += __pad2(d.getUTCDate(), "0");
  __p += ' ';
  __p += __pad2(d.getUTCHours(), "0");
  __p += ':';
  __p += __pad2(d.getUTCMinutes(), "0");
  __p += ':';
  __p += __pad2(d.getUTCSeconds(), "0");
  __p += ',';
  __p += __padZero3(d.getUTCMilliseconds());
  __p += '000';
  return __p;
}

function v2(d) {
  var __padZero3 = padZero3, __p = '';
  __p += formats.Y.format(d);
  __p += '/';
  __p += formats.m.format(d);
  __p += '/';
  __p += formats.d.format(d);
  __p += ' ';
  __p += formats.H.format(d);
  __p += ':';
  __p += formats.M.format(d);
  __p += ':';
  __p += formats.S.format(d);
  __p += ',';
  __p += __padZero3(d.getUTCMilliseconds());
  __p += '000';
  return __p;
}

var Benchmark = require('benchmark');

var suite = new Benchmark.Suite('strftime');

var d = new Date();

suite
  .add('v1', function() {
    v1(d);
  })
  .add('v2', function() {
    v2(d);
  })

suite
// add listeners
  .on('cycle', function (event) {
    console.warn(String(event.target));
  })
// run async
  .run();
