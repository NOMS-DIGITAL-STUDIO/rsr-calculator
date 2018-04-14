const should = require('chai').should();
require('./assertionWithinExpectedTolerance');

const EXPECTEED_TOLERANCE = 8;

const DATE_TYPE_FIELDS = [
  'birthDate',
  'convictionDate',
  'sentenceDate',
  'firstSanctionDate',
  'assessmentDate',
  'mostRecentSexualOffence'
];

const OUTPUT_TYPE_FIELDS = [
  'output_sv_static',
  'output_sv_dynamic',
  'output_male_sex',
  'output_non_sex',
  'output_female_sex',
  'output_rsr_best',
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

const createCorrectResultsObject = (x) => {
  var out = {};
  OUTPUT_TYPE_FIELDS.forEach((key) => (x[key] || x[key] === false) && (out[key] = x[key]));
  return out;
};

const formatedOffenderRawData = (x) =>
  Object.assign(cloneWithDateObjects(x), { correct_results: createCorrectResultsObject(x) });

const runTestWithData = (calc, p) => (x) => () => {
  var result = calc(x);
  should.not.exist(result.errors);
  result.should.have.property('riskOfSeriousRecidivism');
  result.riskOfSeriousRecidivism[1].should.be.withinExpectedTolerance(x, EXPECTEED_TOLERANCE);
};

const addTest = (calc, p) => (i, x) => {
  var fn = (x.execution === true ? it : it.skip);
  fn('should pass test number ' + i + '  <' + x.pncId + '>', runTestWithData(calc, p)(formatedOffenderRawData(x)));
};

const addListOfTests = (calc, p) => (a) =>
  a.forEach((x, i) => addTest(calc, p)(i, x));

const addFilteredListOfTests = (calc, p) => (a, ids) =>
  ids.forEach((id) => addTest(calc, p)(id, a[id]));

module.exports = {
  runTestWithData: runTestWithData,
  addListOfTests: addListOfTests,
  addFilteredListOfTests: addFilteredListOfTests,
};
