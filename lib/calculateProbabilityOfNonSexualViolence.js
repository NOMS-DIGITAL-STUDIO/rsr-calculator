const Sex = {
  Male: 0,
  Female: 1
};

const log = (label, x) => {
  console.log(label, x);
  return x || label;
};

const dateDiff = (d1, d2) =>
  (d1.getFullYear() - d2.getFullYear()) -
  ((d1.getMonth() - d2.getMonth() < 0) || (d1.getMonth() - d2.getMonth() === 0 && d1.getDate() - d2.getDate() < 0) ? 1 : 0);

const monthDiff = (d1, d2) =>
  ((d1.getFullYear() - d2.getFullYear()) * 12) + (d1.getMonth() - d2.getMonth());

// logistic regression function
const logisticCurve = (x) => ((ex) => ex / (1 + ex))(Math.exp(x));

const sum = (...x) => x.reduce((a, b) => a + b, 0);

const sexBasedFactor = (maleFactor, femaleFactor, sex) => {
  switch (sex) {
    case Sex.Male: return maleFactor;
    case Sex.Female: return femaleFactor;
    default: return 0;
  }
};

const calcMaleAgePolynomial = (x, n) =>
  (Math.pow(n, 1) * x.coefficients.maleaai) +
  (Math.pow(n, 2) * x.coefficients.maleaaiaai) +
  (Math.pow(n, 3) * x.coefficients.maleaaiaaiaai) +
  (Math.pow(n, 4) * x.coefficients.maleaaiaaiaaiaai);
const calcMaleAgePolynomialFactor = (x) =>
  calcMaleAgePolynomial(x, x.ageAtRiskDate);

const calcfemaleAgePolynomial = (x, n) =>
  x.coefficients.female +
  (Math.pow(n, 1) * x.coefficients.aaifemale) +
  (Math.pow(n, 2) * x.coefficients.aaiaaifemale) +
  (Math.pow(n, 3) * x.coefficients.aaiaaiaaifemale) +
  (Math.pow(n, 4) * x.coefficients.aaiaaiaaiaaifemale);
const calcfemaleAgePolynomialFactor = (x) =>
  calcfemaleAgePolynomial(x, x.ageAtRiskDate);

const calcAgePolynomialFactor = (x) =>
  sexBasedFactor(calcMaleAgePolynomialFactor(x), calcfemaleAgePolynomialFactor(x), x.sex);

const calcOffenceFreeMonthsPolynomial = (x, n) =>
  (Math.pow(n, 1) * x.coefficients.OffenceFreeMonths1) +
  (Math.pow(n, 2) * x.coefficients.OffenceFreeMonths2) +
  (Math.pow(n, 3) * x.coefficients.OffenceFreeMonths3) +
  (Math.pow(n, 4) * x.coefficients.OffenceFreeMonths4);
const calcOffenceFreeMonthsPolynomialFactor = (x) =>
  calcOffenceFreeMonthsPolynomial(x, x.offenderOffenceFreeMonths);

const calcVATPFactor = (x) =>
  (x.currentOffenceType === 18) ? x.coefficients.vatpLookup[x.violentOffenceCategory] : 0;

const calcFirstSanctionFactor = (x) =>
  x.coefficients.firstsanction;
const calcSecondSanctionFactor = (x) =>
  x.coefficients.secondsanction + x.yearsSinceFirstSanction *
    sexBasedFactor(x.coefficients.malesecondsanctionyearssincefirs, x.coefficients.femalesecondsanctionyearssincefi, x.sex);
const calcAdditionalSanctionFactor = (x) =>
  Math.log(x.sanctionOccasions / (x.yearsSinceFirstSanction + 12)) *
    sexBasedFactor(x.coefficients.malethreeplussanctionsogrs4v_rat, x.coefficients.femalethreeplussanctionsogrs4v_r, x.sex);
const calcNumberOfSanctionsFactor = (x) => {
  switch (x.sanctionOccasions) {
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
  x.sanctionOccasions * x.coefficients.ogrs3_sanctionoccasions;

const calcOGRS4OffenceFactor = (x) =>
  x.coefficients.offenceCategoriesLookup[x.currentOffenceType];

const calcOGRS4ViolentSanctionsFactor = (x) =>
  x.OGRS4v;

const calcOGRS4g = (x) =>
  sum(
    x.agePolynomialFactor,
    x.numberOfSanctionsFactor,             // NaN
    x.offenceFreeMonthsPolynomialFactor,
    x.VATPFactor,                          // violence against a person
    x.OGRS3SanctionOccasionsFactor,
    x.OGRS4OffenceFactor,                  // undefined
    x.OGRS4ViolentSanctionsFactor,
    x.OASysPolynomial
  );

const withInputs = (fn) => (x) => {
  let y = {
    // coefficients
    coefficients: x.coefficients,

    sex: parseInt(x.sex || 0, 10),
    currentOffenceType: parseInt(x.currentOffenceType || 0, 10),
    violentOffenceCategory: parseInt(x.violentOffenceCategory || 0, 10),
    OGRS4v: x.OGRS4v,

    yearsSinceFirstSanction: dateDiff(x.convictionDate, x.birthDate) - dateDiff(x.firstSanctionDate, x.birthDate),
    ageAtRiskDate: dateDiff(x.sentenceDate, x.birthDate),
    sanctionOccasions: Math.min(50, parseInt(x.previousSanctions || 0, 10) + 1),
    offenderOffenceFreeMonths: Math.min(36, monthDiff(x.assessmentDate, x.sentenceDate)),
  };

  return fn({
    agePolynomialFactor: calcAgePolynomialFactor(y),
    numberOfSanctionsFactor: calcNumberOfSanctionsFactor(y),
    offenceFreeMonthsPolynomialFactor: calcOffenceFreeMonthsPolynomialFactor(y),
    VATPFactor: calcVATPFactor(y),
    OGRS3SanctionOccasionsFactor: calcOGRS3SanctionOccasionsFactor(y),
    OGRS4OffenceFactor: calcOGRS4OffenceFactor(y),
    OGRS4ViolentSanctionsFactor: calcOGRS4ViolentSanctionsFactor(y),
    OASysPolynomial: x.OASysPolynomial
  });
};

// helpers

// public
module.exports = (x) =>
  [x.coefficients.Intercept_1, x.coefficients.Intercept_2]
    .map((i) => logisticCurve(i + withInputs(calcOGRS4g)(x)));
