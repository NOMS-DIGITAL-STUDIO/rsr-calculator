// dependencies
const util = require('util');
const pkg = require('../package.json');
const calcContactSexualProbability = require('./calculateContactSexualProbability');
const calcIndecentImageProbability = require('./calculateIndecentImageProbability');
const calcProbabilityOfNonSexualViolence = require('./calculateProbabilityOfNonSexualViolence');
const calcRiskOfSeriousRecidivismNodeJS = require('./calculateRiskOfSeriousRecidivism');
const calcOGRS4s = require('./calculateOGRS4s');
const calcOGRS4v = require('./calculateOGRS4v');
const calcOGRS3 = require('./calculateOGRS3');
const calcRiskOfSeriousRecidivismBeta18 = require('../lib/calculateRiskOfSeriousRecidivismBeta18');

const printOffenderData = require('./printOffenderData');

const coefficients = require('./data/coefficients.json');

const pick = (p) => (x) => x[p];

const calcPercentileRisk = (n) => 100 * n.toFixed(4);

const dateDiff = (d1, d2) =>
  (d1.getFullYear() - d2.getFullYear()) -
  ((d1.getMonth() - d2.getMonth() < 0) || (d1.getMonth() - d2.getMonth() === 0 && d1.getDate() - d2.getDate() < 0) ? 1 : 0);

// extended static / dynamic || brief static
const appropriateCoefficients = (coefficients, x) => {
  var type = (x.oasysInterview === 0) ? 0 : 1; // 0 === extended, 1 === basic
  var out = {};

  for (var c in coefficients) {
    var a = coefficients[c];
    switch (c) {
      case 'offenceCategoriesLookup':
      case 'vatpLookup':
        out[c] = a.map(pick(type));
        break;
      default:
        out[c] = util.isArray(a) ? a[type] : a;
    }
  }

  return out;
};

const withCoefficients = (x) => {
  x.coefficients = appropriateCoefficients(coefficients, x);
  return x;
};

const calcOGRS3PercentileRisk = (x) =>
  x.OGRS3.result.map(calcPercentileRisk);

const calcRSRPercentileRisk = (p) => (x) =>
  x[p].map(calcPercentileRisk);

// OGRS4s risk band = 0-11 = low, 12-14 = medium, 15-17 = high, 18+ V. High
const calcOGRS4sRiskBand = (x) =>
  (x.OGRS4s < 12) ? 'Low' : (x.OGRS4s < 15) ? 'Medium' : (x.OGRS4s < 18) ? 'High' : 'Very high';

const calcRSRRiskBand = (p) => (x) =>
  x[p].map((p) => (p < 0.03) ? 'Low' : (p < 0.069) ? 'Medium' : 'High');

const withValidInputs = (x, fn) => {
  x.errors = [];

  [
    'birthDate',
    'convictionDate',
    'sentenceDate',
    'firstSanctionDate',
    'assessmentDate',
  ]
  .forEach(p => {
    if (new Date(x[p]).toString() === 'Invalid Date' || new Date(x[p]).getYear() < 0) {
      x.errors.push({
        [p]: `"${p}" must be a valid date`
      });
    }
  });

  if (x.mostRecentSexualOffence &&
        (new Date(x.mostRecentSexualOffence).toString() === 'Invalid Date' || new Date(x.mostRecentSexualOffence).getYear() < 0)) {
    delete x.mostRecentSexualOffence;
  }

  if (!x.errors.length) {
    if (dateDiff(x.assessmentDate, x.birthDate) < 17) {
      x.errors.push({
        birthDate: 'Offender must be an adult'
      });
    }

    if (dateDiff(x.sentenceDate, x.convictionDate) < 0) {
      x.errors.push({
        convictionDate: '"convictionDate" must be earlier than "sentenceDate"'
      });
    }

    if (x.mostRecentSexualOffence && dateDiff(x.firstSanctionDate, x.mostRecentSexualOffence) > 0) {
      x.errors.push({
        mostRecentSexualOffence: '"mostRecentSexualOffence" must be a later date than "firstSanctionDate"'
      });
    }
  }

  if (x.errors.length) {
    x.errors = x.errors.reduce((a, b) => Object.assign(a, b), {});
    return x;
  }

  delete x.errors;

  return fn(x);
};

const collect = (arr) => (x) =>
  arr.reduce((a, b) => {
    a[b[0]] = b[1](a);
    return a;
  }, withCoefficients(x));

const calculateRisk = (x) =>
  withValidInputs(x, collect([
    ['OGRS3', calcOGRS3],
    ['OGRS4s', calcOGRS4s],
    ['OGRS4v', calcOGRS4v],

    ['rsrBeta18', (x) => calcRiskOfSeriousRecidivismBeta18(x)],

    ['probabilityOfNonSexualViolence', calcProbabilityOfNonSexualViolence],
    ['indecentImageProbability', calcIndecentImageProbability],
    ['contactSexualProbability', calcContactSexualProbability],
    ['riskOfSeriousRecidivismBeta18', (x) => x.rsrBeta18.totalRSR],
    ['riskOfSeriousRecidivismNodeJS', calcRiskOfSeriousRecidivismNodeJS],

    ['OGRS4sRiskBand', calcOGRS4sRiskBand],
    ['OGRS3PercentileRisk', calcOGRS3PercentileRisk],
    ['RSRPercentileRiskBeta18', calcRSRPercentileRisk('riskOfSeriousRecidivismBeta18')],
    ['RSRRiskBandBeta18', calcRSRRiskBand('riskOfSeriousRecidivismBeta18')],
    ['RSRPercentileRiskNodeJS', calcRSRPercentileRisk('riskOfSeriousRecidivismNodeJS')],
    ['RSRRiskBandNodeJS', calcRSRRiskBand('riskOfSeriousRecidivismBeta18')],

    ['riskOfSeriousRecidivism', pick('riskOfSeriousRecidivismBeta18')],
    ['RSRPercentileRisk', pick('RSRPercentileRiskBeta18')],
    ['RSRRiskBand', pick('RSRRiskBandBeta18')],
  ]));

const calculateOGRS3 = (x) =>
  collect([
    ['OGRS3', calcOGRS3],
    ['OGRS3PercentileRisk', calcOGRS3PercentileRisk],
  ])(x);

const withCalculatorVersion = (fn) => (x) => {
  var result = fn(x);
  result.calculatorVersion = pkg.version;
  return result;
};

// public
module.exports = {
  calculateRisk: withCalculatorVersion(calculateRisk),
  calculateOGRS3: withCalculatorVersion(calculateOGRS3),
  printOffenderData: printOffenderData,
  calculatorVersion: pkg.version,
};
