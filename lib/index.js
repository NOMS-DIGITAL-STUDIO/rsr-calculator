// dependencies
const pkg = require('../package.json');
const calcOASysScore = require('./calculateOASysFactor');
const calcOffenderSexualPredictorScore = require('./scoreOffenderSexualPredictor');
const calcRiskOfSeriousRecidivismScore = require('./scoreRiskOfSeriousRecidivism');
const calcContactSexualProbability = require('./calculateContactSexualProbability');
const calcIndecentImageProbability = require('./calculateIndecentImageProbability');
const calcProbabilityOfNonSexualViolence = require('./calculateProbabilityOfNonSexualViolence');
const calcRiskOfSeriousRecidivism = require('./calculateRiskOfSeriousRecidivism');

const printOffenderData = require('./printOffenderData');

const calculateRisk = (x) => [
    ['oasysScore', calcOASysScore],
    //['offenderSexualPredictorScore', calcOffenderSexualPredictorScore],
    ['riskOfSeriousRecidivismScore', calcRiskOfSeriousRecidivismScore],
    ['probabilityOfNonSexualViolence', calcProbabilityOfNonSexualViolence],
    ['indecentImageProbability', calcIndecentImageProbability],
    ['contactSexualProbability', calcContactSexualProbability],
    ['riskOfSeriousRecidivism', calcRiskOfSeriousRecidivism]
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
