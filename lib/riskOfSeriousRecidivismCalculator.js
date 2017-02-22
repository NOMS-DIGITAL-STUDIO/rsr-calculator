
const Sex = {
  Male: 0,
  Female: 1
};

// Parameters
const Intercept_1 = [1.78331927182645, 2.99795558254740];
const Intercept_2 = [2.39022796091603, 3.60407707356772];

//Sex
const maleaai = [-0.508802063507919, -0.546062410902905];
const maleaaiaai = [0.0153890192629454, 0.0170043887737295];
const maleaaiaaiaai = [-0.000208800171123703, -0.000232716989498981];
const maleaaiaaiaaiaai = [0.000000983824143383739, 0.000001094922933981];

const female = [-16.69272926978470, -16.62202700890110];
const aaifemale = [1.14364995500560, 1.09365106131567];
const aaiaaifemale = [-0.0448159815299769, -0.042733609488121];
const aaiaaiaaifemale = [0.000731812620052307, 0.000697583963826421];
const aaiaaiaaiaaifemale = [-0.00000424504210770651, -0.00000404895085233227];

//Offence categories
const offenceCategoriesLookup = [[0.271350568105055, 0.304896300301182],[0.264445840395185, 0.326858080852591], [0.123617390798186, 0.151649692548355], [-0.225990540250696, -0.194200416367268], [0.156493599418026, 0.186977546333514], [-0.210828726274969, -0.212258595209629], [0.130461601097636, 0.0818982459627011], [0.081753216630546, 0.0694507822486554], [0.0923765737156082, 0.0841789642942883], [-0.0883945245425247, -0.136811424047985], [-0.211172350332101, -0.224505821312900], [0.00778028771796321, -0.0286442357674878], [-0.226808217378264, -0.215779995107354], [0.0206396832377319, 0.0446132016665715], [-0.407005679932105, -0.442179128494551], [-0.067383107093799, -0.0455228893277184], [0.0187611938936452, 0.0202407984946185], [0.194487131847261, 0.226781312933932], [-0.00653849840412098, 0.0192703822415124], [0.0819545573517356, -0.0169128022430282]];
const vatpLookup = [[0,0], [0.41315945136753, 0.503126183131338], [0.261448353627646, 0.296194351653227], [0.200143106218146, 0.331898861349699], [0.204895023669854, 0.238802610774108]];

//Criminal history
const firstsanction = [-1.89458617745666, -2.09447596484765];
const secondsanction = [-1.51763151836726, -1.67613460779912];
const ogrs3_sanctionoccasions = [-0.0182592921752245, -0.0147495874606046];
const malesecondsanctionyearssincefirs = [-0.0271828619470523, -0.0292205730647305];
const femalesecondsanctionyearssincefi = [-0.0960719132524968, -0.0841673003341906];
const ofm = [-0.0368447371150021, -0.038382727965819];
const ofmofm = [0.000557887384281899, 0.000548515180678996];
const ofmofmofm = [0.0000615531052486415, 0.0000662558757635182];
const ofmofmofmofm = [-0.00000149652694510477, -0.00000159636460181398];
const malethreeplussanctionsogrs4v_rat = [0.689153313085879, 0.769213898314811];
const femalethreeplussanctionsogrs4v_r = [0.76704149890481, 0.793186572461819];
const maleneverviolent = [-0.35940007303088, -0.942816163300621];
const femaleneverviolent = [-1.75135363711310, -2.32321324569237];
const onceviolent = [-0.101514048705338, -0.0633592949212861];
const ogrs3_ovp_sanct = [0.021160895925655, 0.0188685880078656];
const ogrs4v_rate_violent = [0.0549319831836878, 0.207442427665471];

//OASys
const S2Q2A = 0.15071282416667;
const S3Q4 = 0.0619710049121293;
const S4Q2 = 0.0389109699626767;
const S6Q4 = 0.0259107268767618;
const S9Q1 = 0.0935672441515258;
const S9Q2 = 0.0567127896345591;
const S11Q2 = 0.077212834605957;
const S11Q4 = 0.0482892034688302;
const S12Q1 = 0.130830533773332;
const S6Q7_PERP = 0.0847839330659903;
const pasthomicide = 0.399463399258737;
const pastwoundinggbh = 0.451029720739399;
const pastkidnap = 0.0749101406070305;
const pastfirearm = 0.218055028351022;
const pastrobbery = 0.163248217650296;
const pastaggrburg = 0.506616685297771;
const pastweapon = 0.184104582611966;
const pastcdlife = 0.357345708081477;
const pastarson = 0.12261588608151;

const exponential = (x) => Math.exp(x);
const divisionBySelfPlusOne = (x) => x / (1 + x);
const exponentialDivisionBySelfPlusOne = (x) => divisionBySelfPlusOne(exponential(x));

const dateDiff = (d1, d2) => {
  var result = (d1.getFullYear() - d2.getFullYear());
  return ((d1.getMonth() - d2.getMonth() < 0) || (d1.getMonth() - d2.getMonth() == 0 && d1.getDate() - d2.getDate() < 0)) ? result - 1 : result;
};

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

const calcMaleAgePolynominal = (x) =>
  ((n, s) => (Math.pow(n, 1) * maleaai[s]) +
            (Math.pow(n, 2) * maleaaiaai[s]) +
            (Math.pow(n, 3) * maleaaiaaiaai[s]) +
            (Math.pow(n, 4) * maleaaiaaiaaiaai[s]))(calcAgeAtRiskDate(x), pickOASysInterview(x));

const calcfemaleAgePolynominal = (x) =>
  ((n, s) => female[s] +
          (Math.pow(n, 1) * aaifemale[s]) +
          (Math.pow(n, 2) * aaiaaifemale[s]) +
          (Math.pow(n, 3) * aaiaaiaaifemale[s]) +
          (Math.pow(n, 4) * aaiaaiaaiaaifemale[s]))(calcAgeAtRiskDate(x), pickOASysInterview(x));

const calcOfmPolynomial = (x) =>
  ((n, s) => (Math.pow(n, 1) * ofm[s]) +
            (Math.pow(n, 2) * ofmofm[s]) +
            (Math.pow(n, 3) * ofmofmofm[s]) +
            (Math.pow(n, 4) * ofmofmofmofm[s]))(calcOffenderOfm(x), pickOASysInterview(x));

const calcAgePolynominal = (x) => {
  switch (x.sex) {
    case Sex.Male: // if male
      return calcMaleAgePolynominal(x);
    case Sex.Female: // if female
      return calcfemaleAgePolynominal(x);
    default:
      return 0;
  }
};

const calcOGRS3SanctionOccasionsFactor = (x) =>
  calcSanctionOccasions(x) * ogrs3_sanctionoccasions[pickOASysInterview(x)];

const calcOGRS4OffenceFactor = (x) =>
  offenceCategoriesLookup[x.currentOffenceType][pickOASysInterview(x)];

const calcVATPFactor = (x) =>
  (x.currentOffenceType === 18) ? vatpLookup[x.violentOffenceCategory][pickOASysInterview(x)] : 0;

const calcFirstSanctionFactor = (x) =>
  firstsanction[pickOASysInterview(x)];

const calcSecondSanctionFactor = (x) =>
  secondsanction[pickOASysInterview(x)] + calcYearsSinceFirstSanction(x) *
    sexBasedFactor(malesecondsanctionyearssincefirs, femalesecondsanctionyearssincefi, x)[pickOASysInterview(x)];

const calcAdditionalSanctionFactor = (x) =>
  Math.log(calcSanctionOccasions(x) / (calcYearsSinceFirstSanction(x) + 12)) *
    sexBasedFactor(malethreeplussanctionsogrs4v_rat, femalethreeplussanctionsogrs4v_r, x)[pickOASysInterview(x)];

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

const calcOffenderOfm = (x) => Math.min(36, monthDiff(x.assessmentDate, x.sentenceDate));

const calcNoViolentSanctionsFactor = (x) =>
  sexBasedFactor(maleneverviolent, femaleneverviolent, x)[pickOASysInterview(x)];

const calcViolentSanctionsFactor = (x) => {
  var vs = x.violentSanctions;

  if (vs === 0) return calcNoViolentSanctionsFactor(x);
  return ((s) => (vs * ogrs3_ovp_sanct[s]) + (vs === 1 ? onceviolent[s] : 0) + Math.log(vs / (calcYearsSinceFirstSanction(x) + 30)) * ogrs4v_rate_violent[s])(pickOASysInterview(x));
}

const calcOASysFactor = (o) => {
  if (pickOASysInterview(o) !== 0) return 0;

  var oasys = 0;
  if (o.murder === 0) {
    oasys += pasthomicide;
  }
  if (o.wounding === 0) {
    oasys += pastwoundinggbh;
  }
  if (o.burglary === 0) {
    oasys += pastaggrburg;
  }
  if (o.arson === 0) {
    oasys += pastarson;
  }
  if (o.endagerLife === 0) {
    oasys += pastcdlife;
  }
  if (o.kidnapping === 0) {
    oasys += pastkidnap;
  }
  if (o.firearmPossession === 0) {
    oasys += pastfirearm;
  }
  if (o.robbery === 0) {
    oasys += pastrobbery;
  }
  if (o.anyOtherOffence === 0) {
    oasys += pastweapon;
  }
  if (o.useWeapon === 0) {
    oasys += S2Q2A;
  }

  if (o.accommodation != "" && o.accommodation != null) {
    oasys += o.accommodation * S3Q4;
  }
  if (o.employment  === 0) {
    oasys += 2*S4Q2;
  }
  if (o.relationship != "" && o.relationship != null) {
    oasys += o.relationship * S6Q4;
  }
  if (o.domesticViolence  === 0) {
    oasys += S6Q7_PERP;
  }
  if (o.currentUseOfAlcohol != "" && o.currentUseOfAlcohol != null) {
    oasys += o.currentUseOfAlcohol * S9Q1;
  }
  if (o.bingeDrinking != "" && o.bingeDrinking != null) {
    oasys += o.bingeDrinking * S9Q2;
  }
  if (o.impulsivity != "" && o.impulsivity != null) {
    oasys += o.impulsivity * S11Q2;
  }
  if (o.temper != "" && o.temper != null) {
    oasys += o.temper * S11Q4;
  }
  if (o.proCriminal != "" && o.proCriminal != null) {
    oasys += o.proCriminal * S12Q1;
  }

  return oasys;
};

const calcOSPscoreForContactAdult = (x) => {
  var n = x.contactAdult;

  if (n === 1) return 3;
  if (n === 2) return 5;
  if (n > 2) return 8;
  return 0;
};

const calcOSPscoreForContactChild = (x) => {
  var n = x.contactChild;

  if (n === 1) return 2;
  if (n === 2) return 3;
  if (n > 2) return 4;
  return 0;
};

const calcOSPscoreForParaphilia = (x) => {
  var n = x.paraphilia;

  if (n === 1) return 1;
  if (n === 2) return 2;
  if (n > 2) return 3;
  return 0;
};

const calcOSPscoreForSanctions = (x) => (x.allSanctions > 0) ? 3 : 0;
const calcOSPscoreForStrangerVictim = (x) => (x.strangerVictim === 0) ? 2 : 0;

const calcOSPscoreForAgeAtMostRecentSexOffence = (x) => {
  var n = dateDiff(x.mostRecentSexualOffence, x.birthDate);

  if (n > 17) return 5;
  if (n > 15) return 3;
  if (n > 9) return 0;
  return 0;
}

const calcOSPscoreForAgeAtRiskDate = (x) => {
  var n = calcAgeAtRiskDate(x);

  if (n > 59) return 0;
  if (n > 53) return 1;
  if (n > 47) return 2;
  if (n > 41) return 3;
  if (n > 35) return 4;
  if (n > 29) return 5;
  if (n > 23) return 6;
  if (n > 9) return 7;
  return 0;
};

const calcOSPscore = (x) =>
    calcOSPscoreForContactAdult(x) +
    calcOSPscoreForContactChild(x) +
    calcOSPscoreForParaphilia(x) +
    calcOSPscoreForSanctions(x) +
    calcOSPscoreForStrangerVictim(x) +
    calcOSPscoreForAgeAtMostRecentSexOffence(x) +
    calcOSPscoreForAgeAtRiskDate(x);

const calcContactSexualProbability = (x) => {
  var OSPscore = calcOSPscore(x);
  switch (x.sex) {
    case Sex.Male:
      return [
        exponentialDivisionBySelfPlusOne(-8.817398615 + (0.2545385404 * OSPscore)),
        exponentialDivisionBySelfPlusOne(-8.216503478 + (0.2545385404 * OSPscore)),
      ];
    case Sex.Female:
      return [1 / 193, 1 / 193];
    default:
      return [0, 0];
  }
}

const calcIndecentImageProbability = (x) => {
  // if female
  if (x.sex === Sex.Female) return [0, 0];

   // if no previous sexual offences
  if (x.indecentImage + x.contactChild + x.contactAdult + x.paraphilia == 0) return [0.000098, 0.000152];
  if (x.indecentImage > 1) return [0.038087, 0.057949];
  if (x.indecentImage == 1) return [0.018237, 0.02805];
  if (x.contactChild > 1) return [0.004615, 0.007151];
  if (x.contactChild == 1) return [0.00224, 0.003476];
  return [0.000683, 0.001061];
};

const calcRSRSscore = (x) =>
    calcAgePolynominal(x) +
    calcOGRS4OffenceFactor(x) +
    calcVATPFactor(x) +
    calcOGRS3SanctionOccasionsFactor(x) +
    calcNumberOfSanctionsFactor(x) +
    calcOfmPolynomial(x) +
    calcViolentSanctionsFactor(x) +
    calcOASysFactor(x);

const calcProbabilityOfNonSexualViolence = (x) =>
  [Intercept_1, Intercept_2]
    .map((i) => i[pickOASysInterview(x)])
    .map((i) => exponentialDivisionBySelfPlusOne(i + calcRSRSscore(x)));

const hasSexualElementOrOffence = (x) => x.sexualOffenceHistory + x.sexualElement === 2;

const calcTotalRSR = (x) => {
  var probabilityOfNonSexualViolence = calcProbabilityOfNonSexualViolence(x);

  // if no sexual element or previous sexual offences (i.e. non-sexual offender) ??
  if (hasSexualElementOrOffence(x)) return probabilityOfNonSexualViolence;

  // if either sexual element or previous sexual offences (i.e. sexual offender)
  return ((iip, csp) => [0, 1].map((n) => probabilityOfNonSexualViolence[n] + iip[n] + csp[n]))(calcIndecentImageProbability(x), calcContactSexualProbability(x));
}

// public

module.exports = (x) => calcTotalRSR(x)[1];
