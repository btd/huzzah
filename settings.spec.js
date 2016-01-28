var Settings = require('./settings');
require('should');

describe('LoggerSettings', function() {
  describe('#addHandler', function() {
    it('should add handlers to settings', function() {
      var s = new Settings();

      s._handlers.should.be.empty();

      s.addHandler({});
      s._handlers.should.have.length(1);
    });
  });
});
