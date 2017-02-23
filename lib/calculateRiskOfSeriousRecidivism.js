// dependencies
const calcContactSexualProbability = require('./calculateContactSexualProbability');
const calcIndecentImageProbability = require('./calculateIndecentImageProbability');
const calcProbabilityOfNonSexualViolence = require('./calculateProbabilityOfNonSexualViolence');

// helpers
const hasSexualElementOrOffence = (x) => x.sexualOffenceHistory + x.sexualElement !== 2; // either is not 1

// public

module.exports = (x) => {
  var probabilityOfNonSexualViolence = calcProbabilityOfNonSexualViolence(x);

  if (hasSexualElementOrOffence(x))
    return ((iip, csp) => [0, 1].map((n) => probabilityOfNonSexualViolence[n] + iip[n] + csp[n]))(calcIndecentImageProbability(x), calcContactSexualProbability(x));

  return probabilityOfNonSexualViolence;
};
