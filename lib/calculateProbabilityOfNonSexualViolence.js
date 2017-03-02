const calculateOASysPolynomial = require('./calculateOASysPolynomial');

const Sex = {
  Male: 0,
  Female: 1
};

const dateDiff = (d1, d2) =>
  (d1.getFullYear() - d2.getFullYear()) -
  ((d1.getMonth() - d2.getMonth() < 0) || (d1.getMonth() - d2.getMonth() == 0 && d1.getDate() - d2.getDate() < 0) ? 1 : 0);

const monthDiff = (d1, d2) =>
  ((d1.getFullYear() - d2.getFullYear()) * 12) + (d1.getMonth() - d2.getMonth());

const sexBasedFactor = (maleFactor, femaleFactor, x) => {
  switch (x.sex) {
    case Sex.Male: return maleFactor;
    case Sex.Female: return femaleFactor;
    default: return [0, 0];
  }
};

const pickOASysInterview = (x) => x.oasysInterview;

const calcAgeAtSanction = (x) => dateDiff(x.convictionDate, x.birthDate);
const calcAgeAtFirstSanction = (x) => dateDiff(x.firstSanctionDate, x.birthDate);
const calcYearsSinceFirstSanction = (x) => calcAgeAtSanction(x) - calcAgeAtFirstSanction(x);
const calcAgeAtRiskDate = (x) => dateDiff(x.sentenceDate, x.birthDate);
const calcSanctionOccasions = (x) => Math.min(50, x.allSanctions + 1);
const calcOffenderOffenceFreeMonths = (x) => Math.min(36, monthDiff(x.assessmentDate, x.sentenceDate));

const calcMaleAgePolynomial = (x, n, s) =>
  (Math.pow(n, 1) * x.coefficients.maleaai[s]) +
  (Math.pow(n, 2) * x.coefficients.maleaaiaai[s]) +
  (Math.pow(n, 3) * x.coefficients.maleaaiaaiaai[s]) +
  (Math.pow(n, 4) * x.coefficients.maleaaiaaiaaiaai[s]);
const calcMaleAgePolynomialFactor = (x) =>
  calcMaleAgePolynomial(x, calcAgeAtRiskDate(x), pickOASysInterview(x));

const calcfemaleAgePolynomial = (x, n, s) =>
  x.coefficients.female[s] +
  (Math.pow(n, 1) * x.coefficients.aaifemale[s]) +
  (Math.pow(n, 2) * x.coefficients.aaiaaifemale[s]) +
  (Math.pow(n, 3) * x.coefficients.aaiaaiaaifemale[s]) +
  (Math.pow(n, 4) * x.coefficients.aaiaaiaaiaaifemale[s]);
const calcfemaleAgePolynomialFactor = (x) =>
  calcfemaleAgePolynomial(x, calcAgeAtRiskDate(x), pickOASysInterview(x));

const calcAgePolynomialFactor = (x) => {
  switch (x.sex) {
    case Sex.Male: return calcMaleAgePolynomialFactor(x);
    case Sex.Female: return calcfemaleAgePolynomialFactor(x);
    default: return 0;
  }
};

const calcOffenceFreeMonthsPolynomial = (x, n, s) =>
  (Math.pow(n, 1) * x.coefficients.OffenceFreeMonths1[s]) +
  (Math.pow(n, 2) * x.coefficients.OffenceFreeMonths2[s]) +
  (Math.pow(n, 3) * x.coefficients.OffenceFreeMonths3[s]) +
  (Math.pow(n, 4) * x.coefficients.OffenceFreeMonths4[s]);
const calcOffenceFreeMonthsPolynomialFactor = (x) =>
  calcOffenceFreeMonthsPolynomial(x, calcOffenderOffenceFreeMonths(x), pickOASysInterview(x))

const calcOGRS3SanctionOccasionsFactor = (x) =>
  x.OGRS3;

const calcOGRS4OffenceFactor = (x) =>
  x.coefficients.offenceCategoriesLookup[x.currentOffenceType][pickOASysInterview(x)];

const calcVATPFactor = (x) =>
  (x.currentOffenceType === 18) ? x.coefficients.vatpLookup[x.violentOffenceCategory][pickOASysInterview(x)] : 0;

const calcFirstSanctionFactor = (x) =>
  x.coefficients.firstsanction[pickOASysInterview(x)];
const calcSecondSanctionFactor = (x) =>
  x.coefficients.secondsanction[pickOASysInterview(x)] + calcYearsSinceFirstSanction(x) *
    sexBasedFactor(x.coefficients.malesecondsanctionyearssincefirs, x.coefficients.femalesecondsanctionyearssincefi, x)[pickOASysInterview(x)];
const calcAdditionalSanctionFactor = (x) =>
  Math.log(calcSanctionOccasions(x) / (calcYearsSinceFirstSanction(x) + 12)) *
    sexBasedFactor(x.coefficients.malethreeplussanctionsogrs4v_rat, x.coefficients.femalethreeplussanctionsogrs4v_r, x)[pickOASysInterview(x)];
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
const calcOGRS4v = (x, s) =>
  ((x.violentSanctions * x.coefficients.ogrs3_ovp_sanct[s]) +
  (x.violentSanctions === 1 ? x.coefficients.onceviolent[s] : 0) +
  Math.log(x.violentSanctions / (calcYearsSinceFirstSanction(x) + 30)) * x.coefficients.ogrs4v_rate_violent_parameter_estimate[s]);

const calcWithNoViolentSanctionsFactor = (x) =>
  sexBasedFactor(x.coefficients.maleneverviolent, x.coefficients.femaleneverviolent, x)[pickOASysInterview(x)];
const calcViolentSanctionsFactor = (x) =>
  (x.violentSanctions === 0) ?
    calcWithNoViolentSanctionsFactor(x) :
    calcOGRS4v(x, pickOASysInterview(x));

const calcOGRS4g = (x) =>
  calcAgePolynomialFactor(x) +
  calcVATPFactor(x) +         // violence against a person
  calcNumberOfSanctionsFactor(x) +
  calcOffenceFreeMonthsPolynomialFactor(x) +
  calcOGRS3SanctionOccasionsFactor(x) +
  calcOGRS4OffenceFactor(x) +
  calcViolentSanctionsFactor(x) +
  calculateOASysPolynomial(x);

// helpers

// logistic regression function
const logisticCurve = (x) => ((ex) => ex / (1 + ex))(Math.exp(x));

// public
module.exports = (x) =>
  [x.coefficients.Intercept_1, x.coefficients.Intercept_2]
    .map((i) => logisticCurve(i[x.oasysInterview] + calcOGRS4g(x)));
