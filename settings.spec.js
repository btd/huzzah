var Settings = require('./settings');
var sinon = require('sinon');
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

  describe('#handle', function() {
    it('should delegate call to own handlers', function() {
      var s = new Settings();
      s
        .addHandler({ handle: sinon.spy() })
        .addHandler({ handle: sinon.spy() });

      s.handle({ level: 10 });

      s._handlers.forEach(function(handler) {
        handler.handle.called.should.be.true();
      });
    });
  });
});
