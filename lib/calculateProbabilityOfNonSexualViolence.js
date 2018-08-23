const calculateOASysPolynomial = require('./calculateOASysPolynomial');

// helpers

// logistic regression function
const lr = x => (ex => ex / (1 + ex))(Math.exp(x));

// private

const calcMaleAgePolynomialFactor = (x) =>
  x.coefficients.male[0] +
    (Math.pow(x.ageAtRiskDate, 1) * x.coefficients.male[1]) +
      (Math.pow(x.ageAtRiskDate, 2) * x.coefficients.male[2]) +
        (Math.pow(x.ageAtRiskDate, 3) * x.coefficients.male[3]) +
          (Math.pow(x.ageAtRiskDate, 4) * x.coefficients.male[4]);

const calcfemaleAgePolynomialFactor = (x) =>
  x.coefficients.female[0] +
    (Math.pow(x.ageAtRiskDate, 1) * x.coefficients.female[1]) +
      (Math.pow(x.ageAtRiskDate, 2) * x.coefficients.female[2]) +
        (Math.pow(x.ageAtRiskDate, 3) * x.coefficients.female[3]) +
          (Math.pow(x.ageAtRiskDate, 4) * x.coefficients.female[4]);

const calcAgePolynominal = (x) =>
  x.isMale ? calcMaleAgePolynomialFactor(x) : calcfemaleAgePolynomialFactor(x);

const calcOffenceFreeMonthsPolynomialFactor = (x) =>
  (Math.pow(x.offenceFreeMonths, 1) * x.coefficients.OffenceFreeMonths[0]) +
    (Math.pow(x.offenceFreeMonths, 2) * x.coefficients.OffenceFreeMonths[1]) +
      (Math.pow(x.offenceFreeMonths, 3) * x.coefficients.OffenceFreeMonths[2]) +
        (Math.pow(x.offenceFreeMonths, 4) * x.coefficients.OffenceFreeMonths[3]);

const calcVATPFactor = (x) =>
  (x.currentOffenceType === 18) ? x.coefficients.vatpLookup[x.violentOffenceCategory] : 0;

const calcNumberOfSanctionsFactor = (x) => {
  switch(x.allSanctions) {
    case 1:
      return x.coefficients.firstsanction;

    case 2:  // 2 total sanctions
      let factor = x.isMale ? x.coefficients.malesecondsanctionyearssincefirs : x.coefficients.femalesecondsanctionyearssincefi;

      return x.coefficients.secondsanction +
        ((x.ageAtSanction - x.ageAtFirstSanction) * factor);

    default:  // 3+ total sanctions
      return 0;
  }
};

//checked
const calcOGRS3SanctionOccasionsFactor = (x) =>
  x.allSanctions * x.coefficients.ogrs3_sanctionoccasions;

//checked
const calcOGRS4OffenceFactor = (x) =>
  x.coefficients.offenceCategoriesLookup[x.currentOffenceType];

//checked
const calcWithViolentSanctionsFactor = (x) =>
  (x.violentSanctions > 0) ?
    (x.violentSanctions * x.coefficients.ogrs3_ovp_sanct) + (x.violentSanctions === 1 ? x.coefficients.onceviolent : 0) :
    (x.isMale ? x.coefficients.maleneverviolent : x.coefficients.femaleneverviolent);

//checked
const calcOGRS4ViolentSanctionsFactor = (x) =>
  (x.violentSanctions > 0) ?
    (Math.log(x.violentSanctions / ((x.ageAtSanction - x.ageAtFirstSanction) + 30)) *
      x.coefficients.ogrs4v_rate_violent) : 0;

// checked
const calcOGRS4GSanctionsFactor = (x) =>
  (x.allSanctions >= 3) ?
    Math.log(x.allSanctions / ((x.ageAtSanction - x.ageAtFirstSanction) + 12)) *
      (x.isMale ? x.coefficients.malethreeplussanctionsogrs4v_rat : x.coefficients.femalethreeplussanctionsogrs4v_r) : 0;

const calculateProbabilityOfNonSexualViolence = x =>
  0 + calcAgePolynominal(x) +
      calcOGRS4OffenceFactor(x) +
      calcVATPFactor(x) +
      calcOGRS3SanctionOccasionsFactor(x) +
      calcNumberOfSanctionsFactor(x) +
      calcOGRS4GSanctionsFactor(x) +
      calcOffenceFreeMonthsPolynomialFactor(x) +
      calcWithViolentSanctionsFactor(x) +
      calcOGRS4ViolentSanctionsFactor(x) +
      calculateOASysPolynomial(x);

// public

module.exports = (x) =>
  [x.coefficients.Intercept_1, x.coefficients.Intercept_2]
    .map((i) => lr(i + calculateProbabilityOfNonSexualViolence(x)));
