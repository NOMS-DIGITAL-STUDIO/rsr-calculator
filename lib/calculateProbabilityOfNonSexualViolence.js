const calculateOASysScore = require('./calculateOASysScore');

// helpers

// logistic regression function
const lr = x => (ex => ex / (1 + ex))(Math.exp(x));

// private

const calcMaleAgeFactor = (x) =>
  x.coefficients.male[0] +
    (Math.pow(x.ageAtRiskDate, 1) * x.coefficients.male[1]) +
      (Math.pow(x.ageAtRiskDate, 2) * x.coefficients.male[2]) +
        (Math.pow(x.ageAtRiskDate, 3) * x.coefficients.male[3]) +
          (Math.pow(x.ageAtRiskDate, 4) * x.coefficients.male[4]);

const calcfemaleAgeFactor = (x) =>
  x.coefficients.female[0] +
    (Math.pow(x.ageAtRiskDate, 1) * x.coefficients.female[1]) +
      (Math.pow(x.ageAtRiskDate, 2) * x.coefficients.female[2]) +
        (Math.pow(x.ageAtRiskDate, 3) * x.coefficients.female[3]) +
          (Math.pow(x.ageAtRiskDate, 4) * x.coefficients.female[4]);

const calcAgeFactor = (x) =>
  x.isMale ? calcMaleAgeFactor(x) : calcfemaleAgeFactor(x);

const calcOffenceFreeMonthsFactor = (x) =>
  (Math.pow(x.offenceFreeMonths, 1) * x.coefficients.OffenceFreeMonths[0]) +
    (Math.pow(x.offenceFreeMonths, 2) * x.coefficients.OffenceFreeMonths[1]) +
      (Math.pow(x.offenceFreeMonths, 3) * x.coefficients.OffenceFreeMonths[2]) +
        (Math.pow(x.offenceFreeMonths, 4) * x.coefficients.OffenceFreeMonths[3]);

const calcOffenceCategoryFactor = (x) =>
  x.coefficients.offenceCategoriesLookup[x.currentOffenceType];

const calcViolentAgainstThePersonFactor = (x) =>
  (x.currentOffenceType === 18) ? x.coefficients.vatpLookup[x.violentOffenceCategory] : 0;

const calcNumberOfSanctionsFactor = (x) =>
  x.allSanctions * x.coefficients.ogrs3_sanctionoccasions;

const calcCriminalCareerStatusFactor = (x) => {
  switch(x.allSanctions) {
    case 1:
      return x.coefficients.firstsanction;

    case 2:  // 2 total sanctions
      let factor = x.isMale ? x.coefficients.malesecondsanctionyearssincefirs : x.coefficients.femalesecondsanctionyearssincefi;

      return x.coefficients.secondsanction +
        ((x.ageAtSanction - x.ageAtFirstSanction) * factor);

    default:  // 3+ total sanctions
      return Math.log(x.allSanctions / ((x.ageAtSanction - x.ageAtFirstSanction) + 12)) *
          (x.isMale ? x.coefficients.malethreeplussanctionsogrs4v_rat : x.coefficients.femalethreeplussanctionsogrs4v_r);
  }
};

const calcViolentSanctionsFactor = (x) => {
  switch(x.violentSanctions) {
    case 0:
      return (x.isMale ? x.coefficients.maleneverviolent : x.coefficients.femaleneverviolent);

    default:
      return (x.violentSanctions * x.coefficients.ogrs3_ovp_sanct) + (x.violentSanctions === 1 ? x.coefficients.onceviolent : 0) +
        (Math.log(x.violentSanctions / ((x.ageAtSanction - x.ageAtFirstSanction) + 30)) * x.coefficients.ogrs4v_rate_violent);
  }
};

const calculateProbabilityOfNonSexualViolence = x =>
  0 + calcAgeFactor(x) +
      calcOffenceCategoryFactor(x) +
      calcViolentAgainstThePersonFactor(x) +
      calcCriminalCareerStatusFactor(x) +
      calcNumberOfSanctionsFactor(x) +
      calcViolentSanctionsFactor(x) +
      calcOffenceFreeMonthsFactor(x) +
      calculateOASysScore(x);

// public

module.exports = (x) =>
  [x.coefficients.Intercept_1, x.coefficients.Intercept_2]
    .map((i) => lr(i + calculateProbabilityOfNonSexualViolence(x)));
