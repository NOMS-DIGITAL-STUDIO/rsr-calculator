
// helpers
const Gender = {
  Male: 0,
  Female: 1
};

const yearDiff = (d1, d2) =>
  (d1.getFullYear() - d2.getFullYear()) -
  ((d1.getMonth() - d2.getMonth() < 0) || (d1.getMonth() - d2.getMonth() === 0 && d1.getDate() - d2.getDate() < 0) ? 1 : 0);

// Ordinal logistic regression function
const lr = (x) => ((ex) => ex / (1 + ex))(Math.exp(x));

// private

const getAgeGroupIndex = x => {
  var ag = [ 11, 13, 15, 17, 20, 24, 29, 34, 39, 49 ].findIndex((n) => x.ageAtRiskDate <= n);
  return ag >= 0 ? ag : 10;
};

const calcMaleAgeFactor = (x) =>
  x.coefficients.maleAgeGroupLookup[getAgeGroupIndex(x)];

const calcFemaleAgeFactor = (x) =>
  x.coefficients.femaleAgeGroupLookup[getAgeGroupIndex(x)];

const calcAgeFactor = x =>
  x.isMale ? calcMaleAgeFactor(x) : calcFemaleAgeFactor(x);

const calcNumberOfSanctionsFactor = (x) =>
  x.previousSanctions > 0 ? x.coefficients.repeatOffender : x.coefficients.firstTimeNoCaution;

const calcCopasRateFactor = (x) =>
  x.coefficients.copas * Math.log((x.allSanctions) / (10 + (x.ageAtConvictionDate - x.ageAtFirstSanctionDate)));

const calcOffenceCategoryFactor = x =>
  x.coefficients.offenceCategoriesLookup[x.currentOffenceType];

const calculateOGRS3StaticScore = x =>
  x.ageFactor +
  x.numberOfSanctionsFactor +
  x.copasRate +
  x.currentOffenceFactor;

const calculateOGRS3 = x =>
  ({
    result: [
      x.coefficients.Intercept_1,
      x.coefficients.Intercept_2
    ]
    .map(n => 1 * lr(n + x.staticScore)),
    explain: x,
  });

// public

module.exports = x => {
  let y = {
    coefficients: x.coefficients.OGRS3,

    isMale: parseInt(x.gender || 0, 10) === Gender.Male,
    previousSanctions: Math.min(50, parseInt(x.previousSanctions || 0, 10)),
    allSanctions: parseInt(x.previousSanctions || 0, 10) + 1,
    currentOffenceType: x.currentOffenceType,

    ageAtConvictionDate: yearDiff(x.convictionDate, x.birthDate),
    ageAtFirstSanctionDate: yearDiff(x.firstSanctionDate, x.birthDate),
    ageAtRiskDate: yearDiff(x.assessmentDate, x.birthDate),
  };

  y.ageFactor = calcAgeFactor(y);
  y.numberOfSanctionsFactor = calcNumberOfSanctionsFactor(y);
  y.copasRate = calcCopasRateFactor(y);
  y.currentOffenceFactor = (x.currentOffenceFactor || calcOffenceCategoryFactor(y));

  y.staticScore = calculateOGRS3StaticScore(y);

  return calculateOGRS3(y);
};
