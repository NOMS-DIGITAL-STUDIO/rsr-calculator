/// Parameters
var Intercept_1 = [1.78331927182645, 2.99795558254740];
var Intercept_2 = [2.39022796091603, 3.60407707356772];

//Sex
var maleaai = [-0.508802063507919, -0.546062410902905];
var maleaaiaai = [0.0153890192629454, 0.0170043887737295];
var maleaaiaaiaai = [-0.000208800171123703, -0.000232716989498981];
var maleaaiaaiaaiaai = [0.000000983824143383739, 0.000001094922933981];
var female = [-16.69272926978470, -16.62202700890110];
var aaifemale = [1.14364995500560, 1.09365106131567];
var aaiaaifemale = [-0.0448159815299769, -0.042733609488121];
var aaiaaiaaifemale = [0.000731812620052307, 0.000697583963826421];
var aaiaaiaaiaaifemale = [-0.00000424504210770651, -0.00000404895085233227];

//Offence categories
var offenceCategoriesLookup = [
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
  [0.0819545573517356, -0.0169128022430282]
];
var vatpLookup = [
  [0,0],
  [0.41315945136753, 0.503126183131338],
  [0.261448353627646, 0.296194351653227],
  [0.200143106218146, 0.331898861349699],
  [0.204895023669854, 0.238802610774108]
];

//Criminal history
var firstsanction = [-1.89458617745666, -2.09447596484765];
var secondsanction = [-1.51763151836726, -1.67613460779912];
var ogrs3_sanctionoccasions = [-0.0182592921752245, -0.0147495874606046];
var malesecondsanctionyearssincefirs = [-0.0271828619470523, -0.0292205730647305];
var femalesecondsanctionyearssincefi = [-0.0960719132524968, -0.0841673003341906];
var ofm = [-0.0368447371150021, -0.038382727965819];
var ofmofm = [0.000557887384281899, 0.000548515180678996];
var ofmofmofm = [0.0000615531052486415, 0.0000662558757635182];
var ofmofmofmofm = [-0.00000149652694510477, -0.00000159636460181398];
var malethreeplussanctionsogrs4v_rat = [0.689153313085879, 0.769213898314811];
var femalethreeplussanctionsogrs4v_r = [0.76704149890481, 0.793186572461819];
var maleneverviolent = [-0.35940007303088, -0.942816163300621];
var femaleneverviolent = [-1.75135363711310, -2.32321324569237];
var onceviolent = [-0.101514048705338, -0.0633592949212861];
var ogrs3_ovp_sanct = [0.021160895925655, 0.0188685880078656];
var ogrs4v_rate_violent = [0.0549319831836878, 0.207442427665471];

//OASys
var S2Q2A = 0.15071282416667;
var S3Q4 = 0.0619710049121293;
var S4Q2 = 0.0389109699626767;
var S6Q4 = 0.0259107268767618;
var S9Q1 = 0.0935672441515258;
var S9Q2 = 0.0567127896345591;
var S11Q2 = 0.077212834605957;
var S11Q4 = 0.0482892034688302;
var S12Q1 = 0.130830533773332;
var S6Q7_PERP = 0.0847839330659903;
var pasthomicide = 0.399463399258737;
var pastwoundinggbh = 0.451029720739399;
var pastkidnap = 0.0749101406070305;
var pastfirearm = 0.218055028351022;
var pastrobbery = 0.163248217650296;
var pastaggrburg = 0.506616685297771;
var pastweapon = 0.184104582611966;
var pastcdlife = 0.357345708081477;
var pastarson = 0.12261588608151;



const getIndecentImageProbability = require('./calculateIndecentImageProbability');
const getOSPStaticScore = require('./calculateOSPStaticScore');
const getOffenderSexualProbability = require('./calculateOffenderSexualProbability');

// helpers

// logistic regression function
const lr = n => (ex => ex / (1 + ex))(Math.exp(n));

// calculations

function getVATPolynominal(x) {
  var s = parseInt(x.oasysInterview, 10);
  return (parseInt(x.currentOffenceType, 10) === 18) ? vatpLookup[parseInt(x.violentOffenceCategory, 10)][s] : 0;
}

function getOGRS4OffenceCategoryPolynominal(x) {
  var s = parseInt(x.oasysInterview, 10);
  return offenceCategoriesLookup[parseInt(x.currentOffenceType, 10)][s];
}

function getSanctionsPolynominal(x) {
  var allSanctions = parseInt(x.previousSanctions, 10) + 1;
  var s = parseInt(x.oasysInterview, 10);
  var isMale = (parseInt(x.sex, 10) === 0);

  if (allSanctions === 1) {
    return firstsanction[s];
  }

  if (allSanctions === 2) {
    var ageAtSanction = dateDiff(x.convictionDate, x.birthDate);
    var ageAtFirstSanction = dateDiff(x.firstSanctionDate, x.birthDate);

    return secondsanction[s] +
        ((ageAtSanction - ageAtFirstSanction) * (isMale ? malesecondsanctionyearssincefirs[s] : femalesecondsanctionyearssincefi[s]));
  }

  return 0;
}

function getViolentSanctionsPolynominal(x) {
  var s = parseInt(x.oasysInterview, 10);
  var violentSanctions = parseInt(x.violentSanctions, 10);
  var isMale = parseInt(x.sex, 10) === 0;

  if (violentSanctions > 0) {
    return (violentSanctions * ogrs3_ovp_sanct[s]) + (violentSanctions === 1 ? onceviolent[s] : 0);
  }

  return isMale ? maleneverviolent[s] : femaleneverviolent[s];
}

function getAgePolynominal(x) {
  var s = parseInt(x.oasysInterview, 10);
  var isMale = (parseInt(x.sex, 10) === 0);
  var ageAtRiskDate = dateDiff(x.sentenceDate, x.birthDate);

  return isMale ?
      (Math.pow(ageAtRiskDate, 1) * maleaai[s]) +
        (Math.pow(ageAtRiskDate, 2) * maleaaiaai[s]) +
          (Math.pow(ageAtRiskDate, 3) * maleaaiaaiaai[s]) +
            (Math.pow(ageAtRiskDate, 4) * maleaaiaaiaaiaai[s]) :
      female[s] +
        (Math.pow(ageAtRiskDate, 1) * aaifemale[s]) +
          (Math.pow(ageAtRiskDate, 2) * aaiaaifemale[s]) +
            (Math.pow(ageAtRiskDate, 3) * aaiaaiaaifemale[s]) +
              (Math.pow(ageAtRiskDate, 4) * aaiaaiaaiaaifemale[s]);
}

function getOffenceFreeMonths(x) {
  var s = parseInt(x.oasysInterview, 10);
  var offenceFreeMonths = Math.min(parseInt(monthDiff(x.assessmentDate, x.sentenceDate), 10),  36);

  return (Math.pow(offenceFreeMonths, 1) * ofm[s]) +
           (Math.pow(offenceFreeMonths, 2) * ofmofm[s]) +
             (Math.pow(offenceFreeMonths, 3) * ofmofmofm[s]) +
              (Math.pow(offenceFreeMonths, 4) * ofmofmofmofm[s]);
}

function getOGRS3SanctionsPolynominal(x) {
  var s = parseInt(x.oasysInterview, 10);
  var allSanctions =  Math.min(parseInt(x.previousSanctions, 10) + 1, 50);

  return allSanctions * ogrs3_sanctionoccasions[s];
}

function getOGRS4g(x) {
  var s = parseInt(x.oasysInterview, 10);
  var isMale = (parseInt(x.sex, 10) === 0);
  var allSanctions = (parseInt(x.previousSanctions, 10) + 1);
  var ageAtSanction = dateDiff(x.convictionDate, x.birthDate);
  var ageAtFirstSanction = dateDiff(x.firstSanctionDate, x.birthDate);

  if (allSanctions < 3) {
    return 0;
  }

  var length = (ageAtSanction - ageAtFirstSanction) + 12;
  var rate = Math.log(allSanctions / length);

  return rate * (isMale ? malethreeplussanctionsogrs4v_rat[s] : femalethreeplussanctionsogrs4v_r[s]);
}

function getOGRS4v(x) {
  var violentSanctions = parseInt(x.violentSanctions, 10);
  var s = parseInt(x.oasysInterview, 10);
  var ageAtSanction = dateDiff(x.convictionDate, x.birthDate);
  var ageAtFirstSanction = dateDiff(x.firstSanctionDate, x.birthDate);

  if (violentSanctions === 0) {
    return 0;
  }

  var length = (ageAtSanction - ageAtFirstSanction) + 30;
  var rateViolentVal = Math.log(violentSanctions / length);

  var rateViolent = [ 0.0549319831836878, 0.207442427665471 ][s];
  return rateViolentVal * rateViolent;
}

const validWeightValue = (x) => x !== '' && x != null;
const factorIfValidWeight = (x, n) => validWeightValue(x) ? x * (n || 0) : 0;
const isApplicable = (x) => parseInt(x, 10) === 0 ? 1 : 0;
const factorIfValidNumeric = (x, n) => isApplicable(x) * (n || 0);

function getOASysScore(x) {
  if (x.hasHadOASysInterview) {
    return 0 +
      factorIfValidNumeric(x.murder, pasthomicide) +
      factorIfValidNumeric(x.wounding, pastwoundinggbh) +
      factorIfValidNumeric(x.burglary, pastaggrburg) +
      factorIfValidNumeric(x.arson, pastarson) +
      factorIfValidNumeric(x.endagerLife, pastcdlife) +
      factorIfValidNumeric(x.kidnapping, pastkidnap) +
      factorIfValidNumeric(x.firearmPossession, pastfirearm) +
      factorIfValidNumeric(x.robbery, pastrobbery) +
      factorIfValidNumeric(x.anyOtherOffence, pastweapon) +
      factorIfValidNumeric(x.useWeapon, S2Q2A) +
      factorIfValidWeight(x.accommodation, S3Q4) +
      factorIfValidNumeric(x.employment, 2 * S4Q2) +
      factorIfValidWeight(x.relationship, S6Q4) +
      factorIfValidNumeric(x.domesticViolence, S6Q7_PERP) +
      factorIfValidWeight(x.currentUseOfAlcohol, S9Q1) +
      factorIfValidWeight(x.bingeDrinking, S9Q2) +
      factorIfValidWeight(x.impulsivity, S11Q2) +
      factorIfValidWeight(x.temper, S11Q4) +
      factorIfValidWeight(x.proCriminal, S12Q1);
  }

  return 0;
}

function getNonSexualViolenceProbability(x) {
  var s = parseInt(x.oasysInterview, 10);

  return [ Intercept_1[s], Intercept_2[s] ].map(n => lr(n + x.score));
}

function dateDiff(d1, d2) {
  var result = (d1.getFullYear() - d2.getFullYear());
  if (d1.getMonth() - d2.getMonth() < 0 || (d1.getMonth() - d2.getMonth() === 0 && d1.getDate() - d2.getDate() < 0)) {
    result--;
  }

  return result;
};

function monthDiff(d1, d2) {
  return ((d1.getFullYear() - d2.getFullYear()) * 12) + (d1.getMonth() - d2.getMonth());
}

function calculateScore(o) {
  o.previousSanctions = Math.max(o.previousSanctions || 0, 0);

  var result = {
    agePolynominal: getAgePolynominal({
      birthDate: o.birthDate,
      sentenceDate: o.sentenceDate,
      sex: o.sex,
      oasysInterview: o.oasysInterview
    }),
    OGRS4OffenceCategoryPolynominal: getOGRS4OffenceCategoryPolynominal({
      oasysInterview: o.oasysInterview,
      currentOffenceType: o.currentOffenceType
    }),
    VATPolynominal: getVATPolynominal({
      oasysInterview: o.oasysInterview,
      currentOffenceType: o.currentOffenceType,
      violentOffenceCategory: o.violentOffenceCategory
    }),
    OGRS3SanctionsPolynominal: getOGRS3SanctionsPolynominal({
      previousSanctions: o.previousSanctions,
      oasysInterview: o.oasysInterview
    }),
    sanctionsPolynominal: getSanctionsPolynominal({
      sex: o.sex,
      previousSanctions: o.previousSanctions,
      oasysInterview: o.oasysInterview,
      birthDate: o.birthDate,
      convictionDate: o.convictionDate,
      firstSanctionDate: o.firstSanctionDate
    }),
    OGRS4g: getOGRS4g({
      sex: o.sex,
      birthDate: o.birthDate,
      convictionDate: o.convictionDate,
      firstSanctionDate: o.firstSanctionDate,
      previousSanctions: o.previousSanctions,
      oasysInterview: o.oasysInterview
    }),
    offenceFreeMonths: getOffenceFreeMonths({
      assessmentDate: o.assessmentDate,
      sentenceDate: o.sentenceDate,
      oasysInterview: o.oasysInterview,
    }),
    violentSanctionsPolynominal: getViolentSanctionsPolynominal({
      sex: o.sex,
      violentSanctions: o.violentSanctions,
      oasysInterview: o.oasysInterview
    }),
    OGRS4v: getOGRS4v({
      birthDate: o.birthDate,
      convictionDate: o.convictionDate,
      firstSanctionDate: o.firstSanctionDate,
      oasysInterview: o.oasysInterview,
      violentSanctions: o.violentSanctions,
    }),
    OASysScore: getOASysScore({
      hasHadOASysInterview: parseInt(o.oasysInterview, 10) === 0,

      murder: o.murder,
      wounding: o.wounding,
      burglary: o.burglary,
      arson: o.arson,
      endagerLife: o.endagerLife,
      kidnapping: o.kidnapping,
      firearmPossession: o.firearmPossession,
      robbery: o.robbery,
      anyOtherOffence: o.anyOtherOffence,
      useWeapon: o.useWeapon,
      accommodation: o.accommodation,
      employment: o.employment,
      relationship: o.relationship,
      domesticViolence: o.domesticViolence,
      currentUseOfAlcohol: o.currentUseOfAlcohol,
      bingeDrinking: o.bingeDrinking,
      impulsivity: o.impulsivity,
      temper: o.temper,
      proCriminal: o.proCriminal,

      coefficients: {

      },
    })
  };

  result.indecentImageProbability = getIndecentImageProbability({
    isMale: (parseInt(o.sex, 10) === 0),
    hasSexualHistory: parseInt(o.sexualOffenceHistory, 10) === 0 || parseInt(o.sexualElement, 10) === 0,
    indecentImage: o.indecentImage,
    contactChild: o.contactChild,
    contactAdult: o.contactAdult,
    paraphilia: o.paraphilia
  });

  result.OSPStaticScore = getOSPStaticScore({
    isMale: (parseInt(o.sex, 10) === 0),
    hasSexualHistory: parseInt(o.sexualOffenceHistory, 10) === 0 || parseInt(o.sexualElement, 10) === 0,
    ageAtMostRecentSexOffence: dateDiff(o.mostRecentSexualOffence || o.birthDate, o.birthDate),
    ageAtRiskDate: dateDiff(o.sentenceDate, o.birthDate),

    contactAdult: o.contactAdult,
    contactChild: o.contactChild,
    paraphilia: o.paraphilia,
    previousSanctions: o.previousSanctions,
    strangerVictim: o.strangerVictim
  });

  result.offenderSexualProbability = getOffenderSexualProbability({
    isMale: (parseInt(o.sex, 10) === 0),
    hasSexualHistory: parseInt(o.sexualOffenceHistory, 10) === 0 || parseInt(o.sexualElement, 10) === 0,

    OSPStaticScore: result.OSPStaticScore,
  });

  result.nonSexualViolenceProbability = getNonSexualViolenceProbability({
    oasysInterview: o.oasysInterview,
    score: 0 +
          result.agePolynominal +
          result.OGRS4OffenceCategoryPolynominal +
          result.VATPolynominal +
          result.OGRS3SanctionsPolynominal +
          result.sanctionsPolynominal +
          result.OGRS4g +
          result.offenceFreeMonths +
          result.violentSanctionsPolynominal +
          result.OGRS4v +
          result.OASysScore
  });

  result.totalRSR = [
    result.nonSexualViolenceProbability[0] + result.offenderSexualProbability[0] + result.indecentImageProbability[0],
    result.nonSexualViolenceProbability[1] + result.offenderSexualProbability[1] + result.indecentImageProbability[1]
  ];

  return result;
};

   // public

module.exports = calculateScore;
