
const calcRiskOfSeriousRecidivism = require('./calculateRiskOfSeriousRecidivism');
const printOffenderData = require('./printOffenderData');

// public

module.exports = {
  calculateRisk: (x) => calcRiskOfSeriousRecidivism(x)[1],
  printOffenderData: (x) => printOffenderData(x),
}
