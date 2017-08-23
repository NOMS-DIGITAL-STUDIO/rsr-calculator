// dependencies
const util = require('util');
const pkg = require('../package.json');
const calcContactSexualProbability = require('./calculateContactSexualProbability');
const calcIndecentImageProbability = require('./calculateIndecentImageProbability');
const calcProbabilityOfNonSexualViolence = require('./calculateProbabilityOfNonSexualViolence');
const calcRiskOfSeriousRecidivism = require('./calculateRiskOfSeriousRecidivism');
const calcOGRS4s = require('./calculateOGRS4s');
const calcOGRS4v = require('./calculateOGRS4v');
const calcOGRS3 = require('./calculateOGRS3');

const printOffenderData = require('./printOffenderData');

const coefficients = require('./data/coefficients.json');

const pick = (p) => (x) => x[p];

const calcPercentileRisk = (n) => 1 * parseFloat(Math.round(n * 10000) / 100).toFixed(2);

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

const calcRSRPercentileRisk = (x) =>
  x.riskOfSeriousRecidivism.map(calcPercentileRisk);

// OGRS4s risk band = 0-11 = low, 12-14 = medium, 15-17 = high, 18+ V. High
const calcOGRS4sRiskBand = (x) =>
  (x.OGRS4s < 12) ? 'Low' : (x.OGRS4s < 15) ? 'Medium' : (x.OGRS4s < 18) ? 'High' : 'Very high';

const calcRSRRiskBand = (x) =>
  x.riskOfSeriousRecidivism.map((p) => (p < 0.03) ? 'Low' : (p < 0.069) ? 'Medium' : 'High');

const calculateRisk = (x) => [
    ['OGRS3', calcOGRS3],
    ['OGRS4s', calcOGRS4s],
    ['OGRS4v', calcOGRS4v],

    ['probabilityOfNonSexualViolence', calcProbabilityOfNonSexualViolence],
    ['indecentImageProbability', calcIndecentImageProbability],
    ['contactSexualProbability', calcContactSexualProbability],
    ['riskOfSeriousRecidivism', calcRiskOfSeriousRecidivism],

    ['OGRS4sRiskBand', calcOGRS4sRiskBand],
    ['OGRS3PercentileRisk', calcOGRS3PercentileRisk],
    ['RSRPercentileRisk', calcRSRPercentileRisk],
    ['RSRRiskBand', calcRSRRiskBand],
  ].reduce((a, b) => {
    a[b[0]] = b[1](a);
    return a;
  }, withCoefficients(x));

const calculateOGRS3 = (x) => [
    ['OGRS3', calcOGRS3],
    ['OGRS3PercentileRisk', calcOGRS3PercentileRisk],
  ].reduce((a, b) => {
    a[b[0]] = b[1](a);
    return a;
  }, withCoefficients(x));

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
