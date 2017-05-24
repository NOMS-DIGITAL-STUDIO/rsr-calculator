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

const Coefficients = require('./data/coefficients.json');

const pick = (p) => (x) => x[p];

// extended static / dynamic || brief static
const appropriateCoefficients = (x) => {
  var type = (x.oasysInterview === 0) ? 0 : 1; // 0 === extended, 1 === basic
  var out = {};

  for (var c in Coefficients) {
    switch (c) {
      case 'offenceCategoriesLookup':
      case 'vatpLookup':
        out[c] = Coefficients[c].map(pick(type));
        break;
      default:
        out[c] = util.isArray(Coefficients[c]) ? Coefficients[c][type] : Coefficients[c];
    }
  }

  return out;
};

const withCoefficients = (x) => {
  x.coefficients = appropriateCoefficients(x);
  return x;
};

// OGRS4s risk band = 0-11 = low, 12-14 = medium, 15-17 = high, 18+ V. High
const calcOGRS4sRiskBand = (x) =>
  (x.OGRS4s < 12) ? 'Low' : (x.OGRS4s < 15) ? 'Medium' : (x.OGRS4s < 18) ? 'High' : 'Very high';

const calcOGRS3PercentileRisk = (x) =>
  x.OGRS3.map(
    (score) => 1 * parseFloat(Math.round(score * 10000) / 100).toFixed(2)
  );

const calcRSRPercentileRisk = (x) =>
  x.riskOfSeriousRecidivism.map(
    (score) => 1 * parseFloat(Math.round(score * 10000) / 100).toFixed(2)
  );

const calcRSRRiskBand = (x) =>
  x.riskOfSeriousRecidivism.map((p) =>
    (p < 0.03) ? 'Low' : (p < 0.069) ? 'Medium' : 'High'
  );

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
};
