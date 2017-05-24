// dependencies
const util = require('util');
const pkg = require('../package.json');
const calcContactSexualProbability = require('./calculateContactSexualProbability');
const calcIndecentImageProbability = require('./calculateIndecentImageProbability');
const calcProbabilityOfNonSexualViolence = require('./calculateProbabilityOfNonSexualViolence');
const calcRiskOfSeriousRecidivism = require('./calculateRiskOfSeriousRecidivism');
const calcOGRS4s = require('./calculateOGRS4s');
const calcOGRS4v = require('./calculateOGRS4v')
const calcOGRS3 = require('./calculateOGRS3');

const printOffenderData = require('./printOffenderData');

const Coefficients = {
  Intercept_1: [1.78331927182645, 2.99795558254740],
  Intercept_2: [2.39022796091603, 3.60407707356772],

  maleaai: [-0.508802063507919, -0.546062410902905],
  maleaaiaai: [0.0153890192629454, 0.0170043887737295],
  maleaaiaaiaai: [-0.000208800171123703, -0.000232716989498981],
  maleaaiaaiaaiaai: [0.000000983824143383739, 0.000001094922933981],

  female: [-16.69272926978470, -16.62202700890110],
  aaifemale: [1.14364995500560, 1.09365106131567],
  aaiaaifemale: [-0.0448159815299769, -0.042733609488121],
  aaiaaiaaifemale: [0.000731812620052307, 0.000697583963826421],
  aaiaaiaaiaaifemale: [-0.00000424504210770651, -0.00000404895085233227],

  //Offence categories
  offenceCategoriesLookup: [
    [0.271350568105055, 0.304896300301182],
    [0.264445840395185, 0.326858080852591],
    [0.123617390798186, 0.151649692548355],
    [-0.225990540250696, -0.194200416367268],
    [0.156493599418026, 0.186977546333514],
    [-0.210828726274969, -0.212258595209629],
    [0.130461601097636, 0.0818982459627011],
    [0.081753216630546, 0.0694507822486554],
    [0.0923765737156082, 0.0841789642942883],
    [-0.0883945245425247, -0.136811424047985],
    [-0.211172350332101, -0.224505821312900],
    [0.00778028771796321, -0.0286442357674878],
    [-0.226808217378264, -0.215779995107354],
    [0.0206396832377319, 0.0446132016665715],
    [-0.407005679932105, -0.442179128494551],
    [-0.067383107093799, -0.0455228893277184],
    [0.0187611938936452, 0.0202407984946185],
    [0.194487131847261, 0.226781312933932],
    [-0.00653849840412098, 0.0192703822415124],
    [0.0819545573517356, -0.0169128022430282],
  ],
  vatpLookup: [
    [0,0],
    [0.41315945136753, 0.503126183131338],
    [0.261448353627646, 0.296194351653227],
    [0.200143106218146, 0.331898861349699],
    [0.204895023669854, 0.238802610774108],
  ],

  //Criminal history
  firstsanction: [-1.89458617745666, -2.09447596484765],
  secondsanction: [-1.51763151836726, -1.67613460779912],
  ogrs3_sanctionoccasions: [-0.0182592921752245, -0.0147495874606046],
  malesecondsanctionyearssincefirs: [-0.0271828619470523, -0.0292205730647305],
  femalesecondsanctionyearssincefi: [-0.0960719132524968, -0.0841673003341906],
  OffenceFreeMonths1: [-0.0368447371150021, -0.038382727965819],
  OffenceFreeMonths2: [0.000557887384281899, 0.000548515180678996],
  OffenceFreeMonths3: [0.0000615531052486415, 0.0000662558757635182],
  OffenceFreeMonths4: [-0.00000149652694510477, -0.00000159636460181398],
  malethreeplussanctionsogrs4v_rat: [0.689153313085879, 0.769213898314811],
  femalethreeplussanctionsogrs4v_r: [0.76704149890481, 0.793186572461819],
  maleneverviolent: [-0.35940007303088, -0.942816163300621],
  femaleneverviolent: [-1.75135363711310, -2.32321324569237],
  onceviolent: [-0.101514048705338, -0.0633592949212861],
  ogrs3_ovp_sanct: [0.021160895925655, 0.0188685880078656],
  ogrs4v_rate_violent_parameter_estimate: [0.0549319831836878, 0.207442427665471],

  //OASys
  S2Q2A: 0.15071282416667,
  S3Q4: 0.0619710049121293,
  S4Q2: 0.0389109699626767,
  S6Q4: 0.0259107268767618,
  S9Q1: 0.0935672441515258,
  S9Q2: 0.0567127896345591,
  S11Q2: 0.077212834605957,
  S11Q4: 0.0482892034688302,
  S12Q1: 0.130830533773332,
  S6Q7_PERP: 0.0847839330659903,
  PastHomicide: 0.399463399258737,
  PastWoundingGBH: 0.451029720739399,
  PastKidnap: 0.0749101406070305,
  PastFirearm: 0.218055028351022,
  PastRobbery: 0.163248217650296,
  PastAggresiveBurglary: 0.506616685297771,
  PastWeapon: 0.184104582611966,
  PastCDLife: 0.357345708081477,
  PastArson: 0.12261588608151,

  OGRS3: {
    offenceCategoriesLookup: [
      0,
      -0.5908,
      0.1772,
      0.0368,
      -0.6323,
      0.7548,
      -0.1188,
      0.2382,
      0.6575,
      0.3503,
      0.1552,
      0.7334,
      0.3779,
      0.4224,
      -0.129,
      0.2599,
      0.2023,
      -0.7608,
      0.0788,
      -0.0599
    ],

    ageGroupLookup: [
      // male / female
      [-0.0617, -0.9617],// 16 to under 18
      [-0.6251, -0.8994],// 18 to under 21
      [-1.0485, -1.0315],// 21 to under 25
      [-1.1592, -1.0543],// 25 to under 30
      [-1.3166, -1.1283],// 30 to under 35
      [-1.3527, -1.4186],// 35 to under 40
      [-1.4837, -1.5243],// 40 to under 50
      [-2.0071, -2.4469],// 50 and over
    ],

    firstTimeOffender: 0.12614,
    repeatOffender: 0.46306,

    copas: 1.25112,
  },
};

const pick = (p) => (x) => x[p];

// extended static / dynamic || brief static
const appropriateCoefficients = (x) => {
  var type = (x.oasysInterview === 0) ? 0 : 1; // 0 === extended, 1 === basic
  var out = {};

  for (var c in Coefficients) {
    switch (c) {
      case 'offenceCategoriesLookup':
      case 'vatpLookup':
        out[c] = Coefficients[c].map(pick(type));
        break;
      default:
        out[c] = util.isArray(Coefficients[c]) ? Coefficients[c][type] : Coefficients[c];
    }
  }

  return out;
};

const withCoefficients = (x) => {
  x.coefficients = appropriateCoefficients(x);
  return x;
};

// OGRS4s risk band = 0-11 = low, 12-14 = medium, 15-17 = high, 18+ V. High
const calcOGRS4sRiskBand = (x) =>
  (x.OGRS4s < 12) ? 'Low' : (x.OGRS4s < 15) ? 'Medium' : (x.OGRS4s < 18) ? 'High' : 'Very high';

const calcOGRS3PercentileRisk = (x) =>
  x.OGRS3.map(
    (score) => 1 * parseFloat(Math.round(score * 10000) / 100).toFixed(2)
  );

const calcRSRPercentileRisk = (x) =>
  x.riskOfSeriousRecidivism.map(
    (score) => 1 * parseFloat(Math.round(score * 10000) / 100).toFixed(2)
  );

const calcRSRRiskBand = (x) =>
  x.riskOfSeriousRecidivism.map((p) =>
    (p < 0.03) ? 'Low' : (p < 0.069) ? 'Medium' : 'High'
  );

const calculateRisk = (x) => [
    ['OGRS3', calcOGRS3],
    ['OGRS4s', calcOGRS4s],
    ['OGRS4v', calcOGRS4v],

    ['probabilityOfNonSexualViolence', calcProbabilityOfNonSexualViolence],
    ['indecentImageProbability', calcIndecentImageProbability],
    ['contactSexualProbability', calcContactSexualProbability],
    ['riskOfSeriousRecidivism', calcRiskOfSeriousRecidivism],

    ['OGRS4sRiskBand', calcOGRS4sRiskBand],
    ['OGRS3PercentileRisk', calcOGRS3PercentileRisk],
    ['RSRPercentileRisk', calcRSRPercentileRisk],
    ['RSRRiskBand', calcRSRRiskBand],
  ].reduce((a, b) => {
    a[b[0]] = b[1](a);
    return a;
  }, withCoefficients(x));

const calculateOGRS3 = (x) => [
    ['OGRS3', calcOGRS3],
    ['OGRS3PercentileRisk', calcOGRS3PercentileRisk],
  ].reduce((a, b) => {
    a[b[0]] = b[1](a);
    return a;
  }, withCoefficients(x));

const withCalculatorVersion = (fn) => (x) => {
  var result = fn(x);
  result.calculatorVersion = pkg.version;
  return result;
};

// public
module.exports = {
  calculateRisk: withCalculatorVersion(calculateRisk),
  calculateOGRS3: withCalculatorVersion(calculateOGRS3),
  printOffenderData: printOffenderData,
};
