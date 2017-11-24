var stringify = require("./safe-json-stringify");

describe("Safe JSON.stringify", function() {
  it("should mark property as cycle if was seen before", function() {
    var a = { b: 10 };
    a.a = a;
    stringify(a).should.be.equal('{"b":10,"a":"[Circular]"}');
  });
});
