var LoggerFactory = require('./factory');
var should = require('should');

describe('LoggerFactory', function() {
  describe('#settings', function() {
    it('should return settings by logger name', function() {
      var f = new LoggerFactory();
      should.exist(f.settings('abc'));
    });

    it('should return the same settings for the same name', function() {
      var f = new LoggerFactory();

      var s1 = f.settings('abc');
      var s2 = f.settings('abc');
      var s3 = f.settings('a');

      s1.should.equal(s2);
      s1.should.not.be.equal(s3);
    });
  });

  describe('#get', function() {
    it('should return logger by name', function() {
      var f = new LoggerFactory();
      should.exist(f.get('abc'));
    });

    it('should return the same by name', function() {
      var f = new LoggerFactory();

      var s1 = f.get('abc');
      var s2 = f.get('abc');
      var s3 = f.get('a');

      s1.should.equal(s2);
      s1.should.not.be.equal(s3);
    });
  });
});
