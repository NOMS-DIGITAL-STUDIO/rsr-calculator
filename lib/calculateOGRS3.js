
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

const genderBasedFactor = (maleFactor, femaleFactor, gender, i) => {
  switch (gender) {
    case Gender.Male: return maleFactor[i];
    case Gender.Female: return femaleFactor[i];
    default: return 0;
  }
};

// Ordinal logistic regression function
const ln = (x) => Math.log(x);
const lr = (x) => ((ex) => ex / (1 + ex))(Math.exp(x));

const calcForAgeGroup = (age) => {
  var ag = [ 11, 13, 15, 17, 20, 24, 29, 34, 39, 49 ].findIndex((n) => age <= n);
  return ag >= 0 ? ag : 10;
};

const calcForRepeatOffender = (x) =>
  x && x > 0;

const calcAgePolynomialFactor = (x) =>
  genderBasedFactor(x.coefficients.maleAgeGroupLookup, x.coefficients.femaleAgeGroupLookup, x.gender, x.ageGroupIndex);

const calcNumberOfSanctionsFactor = (x) =>
  x.isRepeatOffender ? x.coefficients.repeatOffender : x.coefficients.firstTimeNoCaution;

const calcForCopasRate = (x) =>
  x.coefficients.copas * ln((x.allSanctions) / (10 + x.criminalCareerLength));

const sumOfParameters = (i, x) =>
  x.agePolynominalFactor +
  x.numberOfSanctionsFactor +
  x.copasRate +
  x.currentOffenceFactor +
  x.coefficients['Intercept_' + i];

const calculateOGRS3 = (x) =>
  ({
    result: [1, 2].map((i) => 1 * lr(sumOfParameters(i, x))),
    explain: x,
  });

const withInputs = (fn) => (x) => {
  let y = {
    coefficients: x.coefficients.OGRS3,
    gender: asGender(x.gender),
    currentOffenceType: x.currentOffenceType,
  };

  y.currentOffenceFactor = x.currentOffenceFactor || y.coefficients.offenceCategoriesLookup[y.currentOffenceType];
  y.previousSanctions = Math.min(50, x.previousSanctions || 0);
  y.allSanctions = y.previousSanctions + 1;
  y.ageAtConvictionDate = dateDiff(x.convictionDate, x.birthDate);
  y.ageAtFirstSanctionDate = dateDiff(x.firstSanctionDate, x.birthDate);
  y.ageAtAssessmentDate = dateDiff(x.assessmentDate, x.birthDate);
  y.criminalCareerLength = y.ageAtConvictionDate - y.ageAtFirstSanctionDate;
  y.ageGroupIndex = calcForAgeGroup(y.ageAtAssessmentDate);
  y.isRepeatOffender = calcForRepeatOffender(x.previousSanctions);
  y.agePolynominalFactor = calcAgePolynomialFactor(y);
  y.numberOfSanctionsFactor = calcNumberOfSanctionsFactor(y);
  y.copasRate = calcForCopasRate(y);

  return fn(y);
};

// public
module.exports =
  withInputs(calculateOGRS3);
