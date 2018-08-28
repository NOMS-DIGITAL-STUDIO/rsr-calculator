
// helpers
const Gender = {
  Male: 0,
  Female: 1
};

const yearDiff = (d1, d2) =>
  (d1.getFullYear() - d2.getFullYear()) -
  ((d1.getMonth() - d2.getMonth() < 0) || (d1.getMonth() - d2.getMonth() === 0 && d1.getDate() - d2.getDate() < 0) ? 1 : 0);

const monthDiff = (d2, d1) =>
  ((d1.getFullYear() - d2.getFullYear()) * 12) + (d1.getMonth() - d2.getMonth());

// Ordinal logistic regression function
const lr = (x) => ((ex) => ex / (1 + ex))(Math.exp(x));

// private

const calcMaleAgeFactor = (x) =>
  x.coefficients.male[0] +
    (Math.pow(x.ageAtRiskDate, 1) * x.coefficients.male[1]) +
      (Math.pow(x.ageAtRiskDate, 2) * x.coefficients.male[2]) +
        (Math.pow(x.ageAtRiskDate, 3) * x.coefficients.male[3]) +
          (Math.pow(x.ageAtRiskDate, 4) * x.coefficients.male[4]);

const calcFemaleAgeFactor = (x) =>
  x.coefficients.female[0] +
    (Math.pow(x.ageAtRiskDate, 1) * x.coefficients.female[1]) +
      (Math.pow(x.ageAtRiskDate, 2) * x.coefficients.female[2]) +
        (Math.pow(x.ageAtRiskDate, 3) * x.coefficients.female[3]) +
          (Math.pow(x.ageAtRiskDate, 4) * x.coefficients.female[4]);

const calcAgeFactor = (x) =>
  x.isMale ? calcMaleAgeFactor(x) : calcFemaleAgeFactor(x);

const calcOffenceCategoryFactor = (x) =>
  x.coefficients.offenceCategoriesLookup[x.currentOffenceType];

const calcNumberOfSanctionsFactor = (x) =>
  x.allSanctions * x.coefficients.sanctionOccasions;

const calcNumberOfViolentSanctionsFactor = x =>
  x.violentSanctions * x.coefficients.violentSanctionOccasions;

const calcCriminalCareerStatusFactor = (x) => {
  switch(x.allSanctions) {
    case 1:
      return x.coefficients.firstSanction;

    case 2:  // 2 total sanctions
      let factor = x.isMale ? x.coefficients.secondSanctionMale : x.coefficients.secondSanctionFemale;

      return ((x.ageAtConvictionDate - x.ageAtFirstSanctionDate) * factor);

    default:  // 3+ total sanctions
      let copasScoreGeneral = Math.log(x.allSanctions / ((x.ageAtConvictionDate - x.ageAtFirstSanctionDate) + 12));

      return (Math.pow(copasScoreGeneral, 1) * (x.isMale ? x.coefficients.copasMale : x.coefficients.copasFemale)[0]) +
        (Math.pow(copasScoreGeneral, 2) * (x.isMale ? x.coefficients.copasMale : x.coefficients.copasFemale)[1]);
  }
};

const calcViolentCareerStatusFactor = (x) => {
  switch(x.violentSanctions) {
    case 0:
      return x.isMale ? x.coefficients.neverViolentMale : x.coefficients.neverViolentFemale;

    default:
      let copasScoreViolent = Math.log(x.violentSanctions / ((x.ageAtConvictionDate - x.ageAtFirstSanctionDate) + 30));

      return (x.violentSanctions === 1 ? x.coefficients.onceViolent : 0) +
        (copasScoreViolent * x.coefficients.copasViolent);
  }
};

const calcOffenceFreeMonthsFactor = (x) =>
  (Math.pow(x.offenceFreeMonths, 1) * x.coefficients.offenceFreeMonths[0]) +
    (Math.pow(x.offenceFreeMonths, 2) * x.coefficients.offenceFreeMonths[1]) +
      (Math.pow(x.offenceFreeMonths, 3) * x.coefficients.offenceFreeMonths[2]) +
        (Math.pow(x.offenceFreeMonths, 4) * x.coefficients.offenceFreeMonths[3]);

const calculateOGRS4VStaticScore = x =>
  x.ageFactor +
  x.criminalCareerStatusFactor +
  x.numberOfSanctionsFactor +
  x.currentOffenceFactor +
  x.offenceFreeMonthsFactor +
  x.numberOfViolentSanctionsFactor +
  x.volientCareerStatusFactor;

const calculateOGRS4V = x =>
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
    coefficients: x.coefficients.OGRS4V,

    isMale: parseInt(x.gender || 0, 10) === Gender.Male,
    allSanctions: parseInt(x.previousSanctions || 0, 10) + 1,
    violentSanctions: parseInt(x.previousSanctions || 0, 10) + 1,
    currentOffenceType: x.currentOffenceType,

    ageAtConvictionDate: yearDiff(x.convictionDate, x.birthDate),
    ageAtFirstSanctionDate: yearDiff(x.firstSanctionDate, x.birthDate),
    ageAtRiskDate: yearDiff(x.assessmentDate, x.birthDate),
    offenceFreeMonths: monthDiff(x.sentenceDate, x.assessmentDate),
  };

  y.ageFactor = calcAgeFactor(y);
  y.criminalCareerStatusFactor = calcCriminalCareerStatusFactor(y);
  y.numberOfSanctionsFactor = calcNumberOfSanctionsFactor(y);
  y.currentOffenceFactor = (x.currentOffenceFactor || calcOffenceCategoryFactor(y));
  y.offenceFreeMonthsFactor = calcOffenceFreeMonthsFactor(y);

  // violence
  y.numberOfViolentSanctionsFactor = calcNumberOfViolentSanctionsFactor(y);
  y.volientCareerStatusFactor = calcViolentCareerStatusFactor(y);

  y.staticScore = calculateOGRS4VStaticScore(y);

  return calculateOGRS4V(y);
};
