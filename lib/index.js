// dependencies
const util = require('util');
const pkg = require('../package.json');

// RSR
const calculateOSPStaticScore = require('./calculateOSPStaticScore');
const calculateOffenderSexualProbability = require('./calculateOffenderSexualProbability');
const calculateIndecentImageProbability = require('./calculateIndecentImageProbability');
const calculateProbabilityOfNonSexualViolence = require('./calculateProbabilityOfNonSexualViolence');
const calculateRiskOfSeriousRecidivism = require('./calculateRiskOfSeriousRecidivism');

// OGRS3
const calcOGRS3 = require('./calculateOGRS3');

// OGRS4
const calcOGRS4G = require('./calculateOGRS4G');
const calcOGRS4V = require('./calculateOGRS4V');

const printOffenderData = require('./printOffenderData');

const coefficients = require('./data/coefficients.json');

// helpers
const Sex = {
  Male: 0,
  Female: 1
};

const pick = p => x => x[p];

const calcPercentileRisk = n =>
  // javascript needs a little help getting its precision correct
  1 * (100 * n.toFixed(4)).toFixed(2);

const yearDiff = (d2, d1) =>
  (d1.getFullYear() - d2.getFullYear()) -
  ((d1.getMonth() - d2.getMonth() < 0) || (d1.getMonth() - d2.getMonth() === 0 && d1.getDate() - d2.getDate() < 0) ? 1 : 0);

const monthDiff = (d2, d1) =>
  ((d1.getFullYear() - d2.getFullYear()) * 12) + (d1.getMonth() - d2.getMonth());

const isMale = x => parseInt(x.sex, 10) === Sex.Male;
const isFemale = x => parseInt(x.sex, 10) === Sex.Female;
const hasSexualHistory = x => x.sexualOffenceHistory === 0 || x.sexualElement === 0;
const hasHadOASysInterview = x => x.oasysInterview === 0;

const calcAgeAtSanction = x => yearDiff(x.birthDate, x.convictionDate);
const calcAgeAtFirstSanction = x => yearDiff(x.birthDate, x.firstSanctionDate);
const calcYearsSinceFirstSanction = x => calcAgeAtSanction(x) - calcAgeAtFirstSanction(x);
const calcAgeAtRiskDate = x => yearDiff(x.birthDate, x.sentenceDate);
const calcAgeAtMostRecentSexualOffence = x => x.mostRecentSexualOffence ? yearDiff(x.birthDate, x.mostRecentSexualOffence) : 0;

const calcSanctionOccasions = x => Math.max(Math.min(50, x.previousSanctions || 0), 0);
const calcOffenceFreeMonths = x => Math.min(parseInt(monthDiff(x.sentenceDate, x.assessmentDate), 10),  36);

// extended static / dynamic || brief static
const appropriateCoefficients = (coefficients, x) => {
  var type = (x.oasysInterview === 0) ? 0 : 1; // 0 === extended, 1 === basic
  var out = {};

  for (var c in coefficients) {
    var a = coefficients[c];
    switch (c) {
      case 'offenceCategoriesLookup':
      case 'vatpLookup':
      case 'male':
      case 'female':
      case 'OffenceFreeMonths':
        out[c] = a.map(pick(type));
        break;
      default:
        out[c] = util.isArray(a) ? a[type] : a;
    }
  }

  return out;
};

const withCoefficients = (x) => {
  x.coefficients = appropriateCoefficients(coefficients, x);
  return x;
};

const calcOGRS3PercentileRisk = x =>
  x.OGRS3.result.map(calcPercentileRisk);

const calcOGRS4GPercentileRisk = x =>
  x.OGRS4G.result.map(calcPercentileRisk);

const calcOGRS4VPercentileRisk = x =>
  x.OGRS4V.result.map(calcPercentileRisk);

const calcRSRPercentileRisk = (p) => (x) =>
  x[p].map(calcPercentileRisk);

const calcOSPRiskBand = (x) =>
  (x.offenderSexualProbability < 0.12) ? 'Low' :
  (x.offenderSexualProbability < 0.15) ? 'Medium' :
  (x.offenderSexualProbability < 0.18) ? 'High' :
                                         'Very high';

const calcRSRRiskBand = (p) => (x) =>
  x[p].map((p) =>
    (p < 0.03)  ? 'Low' :
    (p < 0.069) ? 'Medium' :
                  'High'
  );

const withValidInputs = (x, fn) => {
  let errors = [];

  [
    'birthDate',
    'convictionDate',
    'sentenceDate',
    'firstSanctionDate',
    'assessmentDate',
  ]
  .forEach(p => {
    if (new Date(x[p]).toString() === 'Invalid Date' || new Date(x[p]).getYear() < 0) {
      errors.push({
        [p]: `"${p}" must be a valid date`
      });
    }
  });

  if (x.mostRecentSexualOffence &&
        (new Date(x.mostRecentSexualOffence).toString() === 'Invalid Date' || new Date(x.mostRecentSexualOffence).getYear() < 0)) {
    delete x.mostRecentSexualOffence;
  }

  if (!errors.length) {
    if (yearDiff(x.birthDate, x.assessmentDate) < 17) {
      errors.push({
        birthDate: 'Offender must be an adult'
      });
    }

    if (monthDiff(x.convictionDate, x.sentenceDate) < 0) {
      errors.push({
        convictionDate: '"convictionDate" must be earlier than "sentenceDate"'
      });
    }

    if (x.mostRecentSexualOffence && monthDiff(x.mostRecentSexualOffence, x.firstSanctionDate) > 0) {
      errors.push({
        mostRecentSexualOffence: '"mostRecentSexualOffence" must be a later date than "firstSanctionDate"'
      });
    }
  }

  if (errors.length) {
    x.errors = errors.reduce((a, b) => Object.assign(a, b), {});
    return x;
  }

  return fn(x);
};

const collect = (arr) => (x) =>
  arr.reduce((a, b) => {
    a[b[0]] = b[1](a);
    return a;
  }, withCoefficients(x));

const calculateRisk = (x) =>
  withValidInputs(x, collect([
    ['isMale', isMale],
    ['isFemale', isFemale],
    ['hasSexualHistory', hasSexualHistory],
    ['hasHadOASysInterview', hasHadOASysInterview],

    ['ageAtSanction', calcAgeAtSanction],
    ['ageAtFirstSanction', calcAgeAtFirstSanction],
    ['ageAtRiskDate', calcAgeAtRiskDate],
    ['ageAtMostRecentSexualOffence', calcAgeAtMostRecentSexualOffence],

    // criminal career statistics
    ['yearsSinceFirstSanction', calcYearsSinceFirstSanction],
    ['previousSanctions', o => Math.max(o.previousSanctions || 0, 0)],
    ['allSanctions', o => parseInt(o.previousSanctions, 10) + 1],
    ['sanctionOccasions', calcSanctionOccasions],
    ['offenceFreeMonths', calcOffenceFreeMonths],

    /*
    x = OGP2.getOGP2(x);
    x = OVP2.getOVP2(x);
    */

    // OSP (Offender Sexual Probability) Score
    ['OSPStaticScore', calculateOSPStaticScore],
    ['offenderSexualProbability', calculateOffenderSexualProbability],
    ['indecentImageProbability', calculateIndecentImageProbability],
    ['probabilityOfNonSexualViolence', calculateProbabilityOfNonSexualViolence],
    ['riskOfSeriousRecidivism', calculateRiskOfSeriousRecidivism],

    ['OSPScore', pick('offenderSexualProbability')],
    ['OSPPercentileRisk', calcRSRPercentileRisk('OSPScore')],
    ['OSPRiskBand', calcOSPRiskBand],

    ['RSRScore', pick('riskOfSeriousRecidivism')],
    ['RSRPercentileRisk', calcRSRPercentileRisk('riskOfSeriousRecidivism')],
    ['RSRRiskBand', calcRSRRiskBand('riskOfSeriousRecidivism')],
  ]));

const calculateOGRS3 = (x) =>
  collect([
    ['OGRS3', calcOGRS3],
    ['OGRS3PercentileRisk', calcOGRS3PercentileRisk],
  ])(x);

const calculateOGRS4 = (x) =>
  collect([
    ['OGRS4G', calcOGRS4G],
    ['OGRS4V', calcOGRS4V],
    ['OGRS4GPercentileRisk', calcOGRS4GPercentileRisk],
    ['OGRS4VPercentileRisk', calcOGRS4VPercentileRisk],
  ])(x);

const withCalculatorVersion = (fn) => (x) => {
  var result = fn(x);
  result.calculatorVersion = pkg.version;
  return result;
};

// public
module.exports = {
  calculateRisk: withCalculatorVersion(calculateRisk),
  calculateOGRS3: withCalculatorVersion(calculateOGRS3),
  calculateOGRS4: withCalculatorVersion(calculateOGRS4),
  printOffenderData: printOffenderData,
  calculatorVersion: pkg.version,
};
