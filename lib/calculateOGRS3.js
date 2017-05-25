
// helpers
const Sex = {
  Male: 0,
  Female: 1
};

const dateDiff = (d1, d2) =>
  (d1.getFullYear() - d2.getFullYear()) -
  ((d1.getMonth() - d2.getMonth() < 0) || (d1.getMonth() - d2.getMonth() === 0 && d1.getDate() - d2.getDate() < 0) ? 1 : 0);

const sexBasedFactor = (maleFactor, femaleFactor, sex) => {
  switch (sex) {
    case Sex.Male: return maleFactor;
    case Sex.Female: return femaleFactor;
    default: return 0;
  }
};

// Ordinal logistic regression function
const lr = (x) => ((ex) => ex / (1 + ex))(Math.exp(x));

const calcForOffenceGroupParameter = (x) =>
  x.coefficients.offenceCategoriesLookup[x.currentOffenceType];

const calcForAgeGroup = (x) => {
  var n = x.ageAtAssessmentDate;

  return (n > 49) ? 8 : (n > 39) ? 7 : (n > 34) ? 6 : (n > 29) ? 5 : (n > 24) ? 4 : (n > 20) ? 3 : (n > 17) ? 2 : (n > 15) ? 1 : 0;
};

const calcAgePolynomialFactor = (x) => {
  var g = calcForAgeGroup(x);
  var c = x.coefficients.ageGroupLookup[g];
  return sexBasedFactor(c[0], c[1], x.sex);
};

const calcNumberOfSanctionsFactor = (x) =>
  (x.previousSanctions > 0) ? x.coefficients.repeatOffender : x.coefficients.firstTimeOffender;

const calcForCopasScore = (x) =>
  x.coefficients.copas * Math.log((1 + x.previousSanctions) / (10 + x.ageAtConvictionDate - x.ageAtFirstSanctionDate));

const calcOGRS3 = (x) =>
  calcAgePolynomialFactor(x) +
  calcNumberOfSanctionsFactor(x) +
  calcForCopasScore(x) +
  calcForOffenceGroupParameter(x);

const withInputs = (fn) => (x) =>
  fn({
    coefficients: x.coefficients.OGRS3,

    sex: x.sex,
    currentOffenceType: x.currentOffenceType,
    previousSanctions: Math.min(50, x.previousSanctions || 0),
    ageAtConvictionDate: dateDiff(x.convictionDate, x.birthDate),
    ageAtFirstSanctionDate: dateDiff(x.firstSanctionDate, x.birthDate),
    ageAtAssessmentDate: dateDiff(x.assessmentDate, x.birthDate),
  });

// public
module.exports =
  withInputs((x) => [x.coefficients.Intercept_1, x.coefficients.Intercept_2]
    .map((i) => lr(i + calcOGRS3(x))));

module.exports.calcOGRS3 = calcOGRS3;
module.exports.calcForCopasScore = calcForCopasScore;
module.exports.calcNumberOfSanctionsFactor = calcNumberOfSanctionsFactor;
module.exports.calcAgePolynomialFactor = calcAgePolynomialFactor;
module.exports.calcForAgeGroup = calcForAgeGroup;
module.exports.calcForOffenceGroupParameter = calcForOffenceGroupParameter;
