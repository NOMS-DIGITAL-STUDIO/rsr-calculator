// dependencies
const pkg = require('../package.json');
const calcContactSexualProbability = require('./calculateContactSexualProbability');
const calcIndecentImageProbability = require('./calculateIndecentImageProbability');
const calcProbabilityOfNonSexualViolence = require('./calculateProbabilityOfNonSexualViolence');
const calcRiskOfSeriousRecidivism = require('./calculateRiskOfSeriousRecidivism');
const calcOGRS4s = require('./calculateOGRS4s');

const printOffenderData = require('./printOffenderData');

const calculateRisk = (x) => [
    ['OGRS4s', calcOGRS4s],
    ['probabilityOfNonSexualViolence', calcProbabilityOfNonSexualViolence],
    ['indecentImageProbability', calcIndecentImageProbability],
    ['contactSexualProbability', calcContactSexualProbability],
    ['riskOfSeriousRecidivism', calcRiskOfSeriousRecidivism]

    // extended static / dynamic === brief static x.oasysInterview
  ].reduce((a, b) => {
    a[b[0]] = b[1](a);
    return a;
  }, x);

const withCalculatorVersion = (fn) => (x) => {
  var result = fn(x);
  result.calculatorVersion = pkg.version;
  return result;
};

// public
module.exports = {
  calculateRisk: withCalculatorVersion(calculateRisk),
  printOffenderData: printOffenderData,
}
