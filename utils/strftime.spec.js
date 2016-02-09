var quote = require('./quote');

var compileStrftime = require('./strftime');
require('should');

var EOL = '\n';

var date1 = new Date(2016, 0, 29, 9, 4, 19, 720);
var date2 = new Date(2009, 9, 8, 14, 14, 9, 720);

var testCases = [
  ['test', 'test', 'test'],

  ['%A', 'Friday', 'Thursday'],
  ['%a', 'Fri', 'Thu'],

  ['%B', 'January', 'October'],
  ['%b', 'Jan', 'Oct'],

  ['%C', '20', '20'],

  ['%d', '29', '08'],
  ['%-d', '29', '8'],
  ['%_d', '29', ' 8'],

  ['%e', '29', ' 8'],

  ['%H', '09', '14'],
  ['%-H', '9', '14'],
  ['%_H', ' 9', '14'],

  ['%h', 'Jan', 'Oct'],

  ['%I', '09', '02'],
  ['%-I', '9', '2'],
  ['%_I', ' 9', ' 2'],

  ['%j', '029', '281'],

  ['%k', '09', '14'],
  ['%-k', '9', '14'],
  ['%_k', ' 9', '14'],

  ['%L', '720', '720'],

  ['%l', '09', '02'],
  ['%-l', '9', '2'],
  ['%_l', ' 9', ' 2'],

  ['%M', '04', '14'],
  ['%-M', '4', '14'],
  ['%_M', ' 4', '14'],

  ['%m', '01', '10'],
  ['%-m', '1', '10'],
  ['%_m', ' 1', '10'],

  ['%n', EOL, EOL],

  ['%p', 'AM', 'PM'],
  ['%P', 'am', 'pm'],

  ['%S', '19', '09'],
  ['%-S', '19', '9'],
  ['%_S', '19', ' 9'],

  // XXX it is env specific, find better way
  //['%s', '1454047459', '1254996849'],

  ['%U', '04', '40'],
  ['%-U', '4', '40'],
  ['%_U', ' 4', '40'],

  ['%u', '5', '4'],

  ['%W', '04', '40'],
  ['%-W', '4', '40'],
  ['%_W', ' 4', '40'],

  ['%w', '5', '4'],

  ['%Y', '2016', '2009'],

  ['%y', '16', '09']

  // XXX it is env specific, find better way
  //['%z', '+0400', '+0400'],
  //['%Z', 'MSK', 'MSD'],
];


describe('strftime', function() {
  testCases.forEach(function(testCase) {
    it('should match ' + quote(testCase[0]) + ' to ' + quote(testCase[1]), function() {
      compileStrftime(testCase[0])(date1).should.be.equal(String(testCase[1]));
    });

    it('should match ' + quote(testCase[0]) + ' to ' + quote(testCase[2]), function() {
      compileStrftime(testCase[0])(date2).should.be.equal(String(testCase[2]));
    });
  });

  it('should throw when used not variable that does not exist', function() {
    (function() {
      compileStrftime('%E');
    }).should.throw();
  });
});
