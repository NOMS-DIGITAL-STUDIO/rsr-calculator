// dependencies
const calcContactSexualProbability = require('./calculateContactSexualProbability');
const calcIndecentImageProbability = require('./calculateIndecentImageProbability');
const calcProbabilityOfNonSexualViolence = require('./calculateProbabilityOfNonSexualViolence');
const calcRiskOfSeriousRecidivism = require('./calculateRiskOfSeriousRecidivism');

const printOffenderData = require('./printOffenderData');

const calculateRisk = (x) => [
    ['probabilityOfNonSexualViolence', calcProbabilityOfNonSexualViolence],
    ['indecentImageProbability', calcIndecentImageProbability],
    ['contactSexualProbability',  calcContactSexualProbability],
    ['riskOfSeriousRecidivism', calcRiskOfSeriousRecidivism]
  ].reduce((a, b) => {
    a[b[0]] = b[1](a);
    return a;
  }, x);

// public

module.exports = {
  calculateRisk: (x) => calculateRisk(x).riskOfSeriousRecidivism[1],
  printOffenderData: (x) => printOffenderData(x),
}
