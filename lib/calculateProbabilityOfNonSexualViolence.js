// Parameters
const Intercept_1 = [1.78331927182645, 2.99795558254740];
const Intercept_2 = [2.39022796091603, 3.60407707356772];

// dependencies
const calcRSRScore = require('./scoreRiskOfSeriousRecidivism');

// helpers
const divisionBySelfPlusOne = (x) => x / (1 + x);
const exponentialDivisionBySelfPlusOne = (x) => divisionBySelfPlusOne(Math.exp(x));

const pickOASysInterview = (x) => x.oasysInterview;

// public
module.exports = (x) =>
  [Intercept_1, Intercept_2]
    .map((i) => i[pickOASysInterview(x)])
    .map((i) => exponentialDivisionBySelfPlusOne(i + calcRSRScore(x)));
