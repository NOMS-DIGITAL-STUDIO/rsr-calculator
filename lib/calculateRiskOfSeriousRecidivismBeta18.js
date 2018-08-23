
const getIndecentImageProbability = require('./calculateIndecentImageProbability');
const getOSPStaticScore = require('./calculateOSPStaticScore');
const getOffenderSexualProbability = require('./calculateOffenderSexualProbability');
const getProbabilityOfNonSexualViolence = require('./calculateProbabilityOfNonSexualViolence');
const getRSR = require('./calculateRiskOfSeriousRecidivism');

// helpers

function yearDiff(d1, d2) {
  var result = (d1.getFullYear() - d2.getFullYear());
  if (d1.getMonth() - d2.getMonth() < 0 || (d1.getMonth() - d2.getMonth() === 0 && d1.getDate() - d2.getDate() < 0)) {
    result--;
  }

  return result;
};

function monthDiff(d1, d2) {
  return ((d1.getFullYear() - d2.getFullYear()) * 12) + (d1.getMonth() - d2.getMonth());
}

function calculateScore(o) {
  o.previousSanctions = Math.max(o.previousSanctions || 0, 0);
  o.allSanctions = parseInt(o.previousSanctions, 10) + 1;
  o.isMale = (parseInt(o.sex, 10) === 0);
  o.ageAtMostRecentSexOffence = yearDiff(o.mostRecentSexualOffence || o.birthDate, o.birthDate);
  o.ageAtRiskDate = yearDiff(o.sentenceDate, o.birthDate);
  o.ageAtSanction = yearDiff(o.convictionDate, o.birthDate);
  o.ageAtFirstSanction = yearDiff(o.firstSanctionDate, o.birthDate);
  o.offenceFreeMonths = Math.min(parseInt(monthDiff(o.assessmentDate, o.sentenceDate), 10),  36);
  o.hasHadOASysInterview = parseInt(o.oasysInterview, 10) === 0;
  o.hasSexualHistory = parseInt(o.sexualOffenceHistory, 10) === 0 || parseInt(o.sexualElement, 10) === 0;
  o.OSPStaticScore = getOSPStaticScore(o);
  o.indecentImageProbability = getIndecentImageProbability(o);
  o.offenderSexualProbability = getOffenderSexualProbability(o);
  o.nonSexualViolenceProbability = getProbabilityOfNonSexualViolence(o);
  o.totalRSR = getRSR(o);

  return o;
};

   // public

module.exports = calculateScore;
