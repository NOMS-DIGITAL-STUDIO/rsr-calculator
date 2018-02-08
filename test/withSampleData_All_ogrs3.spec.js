
const calculator = require('../lib').calculateOGRS3;
const fixtures = require('./data/ogrs3.json');

const DATE_TYPE_FIELDS = [
  'birthDate',
  'convictionDate',
  'sentenceDate',
  'firstSanctionDate',
  'assessmentDate',
  'mostRecentSexualOffence'
];

// fixture generators

const parseDate = (input) => {
  var parts = String.prototype.split.call(input || 'sample data', '-');
  return parts.length === 3 ? new Date(parts[0], parts[1]-1, parts[2]) : parts[0];
};

const cloneWithDateObjects = (x) => {
  var out = {};
  for (var key in x) {
    out[key] = ~DATE_TYPE_FIELDS.indexOf(key) ? parseDate(x[key]) : x[key];
  }
  return out;
};

const runTestWithData = (calc, p, v) => (x) => () => {
  var result = calc(x);
  //logResults(result);
  result[p].result[0].should.be.equal(x[v]);
};

const addTest = (calc, p, v) => (i, x) => {
  var fn = (x.execution === true ? it : it.skip);
  fn('should pass test number ' + i + '  <' + x.pncId + '>', runTestWithData(calc, p, v)(cloneWithDateObjects(x)));
};

const addListOfTests = (calc, p, v) => (a) =>
  a.forEach((x, i) => addTest(calc, p, v)(i, x));

const generate = addListOfTests(calculator, 'OGRS3', 'output_ogrs3_year_1');

describe('OGRS3 Calculator', () => {
  describe.skip('when testing the sample data from the spreadsheet',
    () => generate(fixtures));
});
