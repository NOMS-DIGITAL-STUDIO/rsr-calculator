const calculateOASysPolynomial = require('./calculateOASysPolynomial');

// helpers

// logistic regression function
const logisticCurve = x => (ex => ex / (1 + ex))(Math.exp(x));

// private

const calcMaleAgePolynomialFactor = (x) =>
  (Math.pow(x.ageAtSentenceDate, 1) * x.coefficients.maleaai) +
    (Math.pow(x.ageAtSentenceDate, 2) * x.coefficients.maleaaiaai) +
      (Math.pow(x.ageAtSentenceDate, 3) * x.coefficients.maleaaiaaiaai) +
        (Math.pow(x.ageAtSentenceDate, 4) * x.coefficients.maleaaiaaiaaiaai);

const calcfemaleAgePolynomialFactor = (x) =>
  x.coefficients.female +
    (Math.pow(x.ageAtSentenceDate, 1) * x.coefficients.aaifemale) +
      (Math.pow(x.ageAtSentenceDate, 2) * x.coefficients.aaiaaifemale) +
        (Math.pow(x.ageAtSentenceDate, 3) * x.coefficients.aaiaaiaaifemale) +
          (Math.pow(x.ageAtSentenceDate, 4) * x.coefficients.aaiaaiaaiaaifemale);

const calcAgePolynomialFactor = (x) =>
  x.isMale ? calcMaleAgePolynomialFactor(x) : calcfemaleAgePolynomialFactor(x);

const calcOffenceFreeMonthsPolynomialFactor = (x) =>
  (Math.pow(x.offenceFreeMonths, 1) * x.coefficients.OffenceFreeMonths1) +
    (Math.pow(x.offenceFreeMonths, 2) * x.coefficients.OffenceFreeMonths2) +
      (Math.pow(x.offenceFreeMonths, 3) * x.coefficients.OffenceFreeMonths3) +
        (Math.pow(x.offenceFreeMonths, 4) * x.coefficients.OffenceFreeMonths4);

const calcVATPFactor = (x) =>
  (x.currentOffenceType === 18) ? x.coefficients.vatpLookup[x.violentOffenceCategory] : 0;

const calcNumberOfSanctionsFactor = (x) => {
  switch (x.sanctionOccasions) {

    case 1: // 1 sanction
      return x.coefficients.firstsanction;

    case 2:  // 2 total sanctions
      return x.coefficients.secondsanction + x.yearsSinceFirstSanction *
        (x.isMale ? x.coefficients.malesecondsanctionyearssincefirs : x.coefficients.femalesecondsanctionyearssincefi);

    default:  // 3+ total sanctions
      return Math.log(x.sanctionOccasions / (x.yearsSinceFirstSanction + 12)) *
        (x.isMale ? x.coefficients.malethreeplussanctionsogrs4v_rat : x.coefficients.femalethreeplussanctionsogrs4v_r);
  }
};

// OGRS => Offender Group Reconviction Scale
const calcOGRS3SanctionOccasionsFactor = (x) =>
  x.sanctionOccasions * x.coefficients.ogrs3_sanctionoccasions;

const calcOGRS4OffenceFactor = (x) =>
  x.coefficients.offenceCategoriesLookup[x.currentOffenceType];

const calcOGRS4ViolentSanctionsFactor = (x) =>
  x.OGRS4v;

const calcOGRS4g = (x) =>
  calcAgePolynomialFactor(x) +
  calcNumberOfSanctionsFactor(x) +
  calcOffenceFreeMonthsPolynomialFactor(x) +
  calcVATPFactor(x) +         // violence against a person
  calcOGRS3SanctionOccasionsFactor(x) +
  calcOGRS4OffenceFactor(x) +
  calcOGRS4ViolentSanctionsFactor(x) +
  calculateOASysPolynomial(x);

// public

module.exports = (x) =>
  [x.coefficients.Intercept_1, x.coefficients.Intercept_2]
    .map((i) => logisticCurve(i + calcOGRS4g(x)));
