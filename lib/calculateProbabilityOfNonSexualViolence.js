const calculateOASysPolynomial = require('./calculateOASysPolynomial');

const Sex = {
  Male: 0,
  Female: 1
};

const dateDiff = (d1, d2) =>
  (d1.getFullYear() - d2.getFullYear()) -
  ((d1.getMonth() - d2.getMonth() < 0) || (d1.getMonth() - d2.getMonth() === 0 && d1.getDate() - d2.getDate() < 0) ? 1 : 0);

const monthDiff = (d1, d2) =>
  ((d1.getFullYear() - d2.getFullYear()) * 12) + (d1.getMonth() - d2.getMonth());

const sexBasedFactor = (maleFactor, femaleFactor, sex) => {
  switch (sex) {
    case Sex.Male: return maleFactor;
    case Sex.Female: return femaleFactor;
    default: return 0;
  }
};

const calcAgeAtSanction = (x) => dateDiff(x.convictionDate, x.birthDate);
const calcAgeAtFirstSanction = (x) => dateDiff(x.firstSanctionDate, x.birthDate);
const calcYearsSinceFirstSanction = (x) => calcAgeAtSanction(x) - calcAgeAtFirstSanction(x);
const calcAgeAtRiskDate = (x) => dateDiff(x.sentenceDate, x.birthDate);
const calcSanctionOccasions = (x) => Math.max(Math.min(50, x.previousSanctions || 0), 0);
const calcOffenderOffenceFreeMonths = (x) => Math.min(36, monthDiff(x.assessmentDate, x.sentenceDate));

const calcMaleAgePolynomial = (x, n) =>
  (Math.pow(n, 1) * x.coefficients.maleaai) +
  (Math.pow(n, 2) * x.coefficients.maleaaiaai) +
  (Math.pow(n, 3) * x.coefficients.maleaaiaaiaai) +
  (Math.pow(n, 4) * x.coefficients.maleaaiaaiaaiaai);
const calcMaleAgePolynomialFactor = (x) =>
  calcMaleAgePolynomial(x, calcAgeAtRiskDate(x));

const calcfemaleAgePolynomial = (x, n) =>
  x.coefficients.female +
  (Math.pow(n, 1) * x.coefficients.aaifemale) +
  (Math.pow(n, 2) * x.coefficients.aaiaaifemale) +
  (Math.pow(n, 3) * x.coefficients.aaiaaiaaifemale) +
  (Math.pow(n, 4) * x.coefficients.aaiaaiaaiaaifemale);
const calcfemaleAgePolynomialFactor = (x) =>
  calcfemaleAgePolynomial(x, calcAgeAtRiskDate(x));

const calcAgePolynomialFactor = (x) =>
  sexBasedFactor(calcMaleAgePolynomialFactor(x), calcfemaleAgePolynomialFactor(x), x.sex);

const calcOffenceFreeMonthsPolynomial = (x, n) =>
  (Math.pow(n, 1) * x.coefficients.OffenceFreeMonths1) +
  (Math.pow(n, 2) * x.coefficients.OffenceFreeMonths2) +
  (Math.pow(n, 3) * x.coefficients.OffenceFreeMonths3) +
  (Math.pow(n, 4) * x.coefficients.OffenceFreeMonths4);
const calcOffenceFreeMonthsPolynomialFactor = (x) =>
  calcOffenceFreeMonthsPolynomial(x, calcOffenderOffenceFreeMonths(x));

const calcVATPFactor = (x) =>
  (x.currentOffenceType === 18) ? x.coefficients.vatpLookup[x.violentOffenceCategory] : 0;

const calcFirstSanctionFactor = (x) =>
  x.coefficients.firstsanction;
const calcSecondSanctionFactor = (x) =>
  x.coefficients.secondsanction + calcYearsSinceFirstSanction(x) *
    sexBasedFactor(x.coefficients.malesecondsanctionyearssincefirs, x.coefficients.femalesecondsanctionyearssincefi, x.sex);
const calcAdditionalSanctionFactor = (x) =>
  Math.log(calcSanctionOccasions(x) / (calcYearsSinceFirstSanction(x) + 12)) *
    sexBasedFactor(x.coefficients.malethreeplussanctionsogrs4v_rat, x.coefficients.femalethreeplussanctionsogrs4v_r, x.sex);
const calcNumberOfSanctionsFactor = (x) => {
  switch (calcSanctionOccasions(x)) {
    case 1: // 1 sanction
      return calcFirstSanctionFactor(x);
    case 2:  // 2 total sanctions
      return calcSecondSanctionFactor(x);
    default:  // 3+ total sanctions
      return calcAdditionalSanctionFactor(x);
  }
};

// OGRS => Offender Group Reconviction Scale
const calcOGRS3SanctionOccasionsFactor = (x) =>
  calcSanctionOccasions(x) * x.coefficients.ogrs3_sanctionoccasions;

const calcOGRS4OffenceFactor = (x) =>
  x.coefficients.offenceCategoriesLookup[x.currentOffenceType];

const calcOGRS4ViolentSanctionsFactor = (x) =>
  x.OGRS4v;

function log(x) {
  console.log(x);
  return x;
}

const calcOGRS4g = (x) =>
  calcAgePolynomialFactor(x) +
  calcNumberOfSanctionsFactor(x) +
  calcOffenceFreeMonthsPolynomialFactor(x) +
  calcVATPFactor(x) +         // violence against a person
  calcOGRS3SanctionOccasionsFactor(x) +
  calcOGRS4OffenceFactor(x) +
  calcOGRS4ViolentSanctionsFactor(x) +
  calculateOASysPolynomial(x);

// helpers

// logistic regression function
const logisticCurve = (x) => ((ex) => ex / (1 + ex))(Math.exp(x));

// public
module.exports = (x) =>
  [x.coefficients.Intercept_1, x.coefficients.Intercept_2]
    .map((i) => logisticCurve(i + calcOGRS4g(x)));
