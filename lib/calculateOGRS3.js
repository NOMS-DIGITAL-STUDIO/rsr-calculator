
// helpers
const Gender = {
  Male: 0,
  Female: 1
};

const dateDiff = (d1, d2) =>
  (d1.getFullYear() - d2.getFullYear()) -
  ((d1.getMonth() - d2.getMonth() < 0) || (d1.getMonth() - d2.getMonth() === 0 && d1.getDate() - d2.getDate() < 0) ? 1 : 0);

const asGender = (x) =>
  (x === Gender.Female || x === 'F' || x === 'Female') ? Gender.Female : Gender.Male;

const genderBasedFactor = (maleFactor, femaleFactor, gender) => {
  switch (gender) {
    case Gender.Male: return maleFactor;
    case Gender.Female: return femaleFactor;
    default: return 0;
  }
};

// Ordinal logistic regression function
const ln = (x) => Math.log(x);
const lr = (x) => ((ex) => ex / (1 + ex))(Math.exp(x));

const calcForAgeGroup = (x) => {
  var ag = [ 11, 13, 15, 17, 20, 24, 29, 34, 39, 49 ].findIndex((n) => x.ageAtAssessmentDate <= n);
  return ag >= 0 ? ag : 10;
};

const isRepeatOffender = (x) =>
  x.previousSanctions > 0;

const calcForCopasScore = (x) =>
  ln((1 + x.previousSanctions) / (10 + x.ageAtConvictionDate - x.ageAtFirstSanctionDate));

const calcAgePolynomialFactor = (x) =>
  genderBasedFactor(x.coefficients.maleAgeGroupLookup, x.coefficients.femaleAgeGroupLookup, x.gender)[calcForAgeGroup(x)];

const calcNumberOfSanctionsFactor = (x) =>
  isRepeatOffender(x) ? x.coefficients.repeatOffender : x.coefficients.firstTimeNoCaution;

const calcForCopasParameter = (x) =>
  x.coefficients.copas * calcForCopasScore(x);

const calcForOffenceGroupParameter = (x) =>
  x.currentOffenceFactor || x.coefficients.offenceCategoriesLookup[x.currentOffenceType];

const calcOGRS3 = (x) =>
  calcAgePolynomialFactor(x) +
  calcNumberOfSanctionsFactor(x) +
  calcForCopasParameter(x) +
  calcForOffenceGroupParameter(x);

const withInputs = (fn) => (x) =>
  fn({
    coefficients: x.coefficients.OGRS3,

    gender: asGender(x.gender),
    currentOffenceType: x.currentOffenceType,
    currentOffenceFactor: x.currentOffenceFactor,
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
