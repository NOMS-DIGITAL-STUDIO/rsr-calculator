
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
var malesecondsanctionyearssincefirs = [-0.0271828619470523, -0.0292205730647305];
var femalesecondsanctionyearssincefi = [-0.0960719132524968, -0.0841673003341906];
const ofm = [-0.0368447371150021, -0.038382727965819];
const ofmofm = [0.000557887384281899, 0.000548515180678996];
const ofmofmofm = [0.0000615531052486415, 0.0000662558757635182];
const ofmofmofmofm = [-0.00000149652694510477, -0.00000159636460181398];
var malethreeplussanctionsogrs4v_rat = [0.689153313085879, 0.769213898314811];
var femalethreeplussanctionsogrs4v_r = [0.76704149890481, 0.793186572461819];
var maleneverviolent = [-0.35940007303088, -0.942816163300621];
var femaleneverviolent = [-1.75135363711310, -2.32321324569237];
const onceviolent = [-0.101514048705338, -0.0633592949212861];
var ogrs3_ovp_sanct = [0.021160895925655, 0.0188685880078656];
const ogrs4v_rate_violent = [0.0549319831836878, 0.207442427665471];

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


var FIELDS_TO_OUTPUT = [
   "testNumber",
    "execution",
    "birthDate",
    "sex",
    "pncId",
    "currentOffenceType",
    "convictionDate",
    "sentenceDate",
    "sexualElement",
    "strangerVictim",
    "violentOffenceCategory",
    "firstSanctionDate",
    "allSanctions",
    "violentSanctions",
    "sexualOffenceHistory",
    "mostRecentSexualOffence",
    "contactAdult",
    "contactChild",
    "indecentImage",
    "paraphilia",
    "murder",
    "wounding",
    "burglary",
    "arson",
    "endagerLife",
    "kidnapping",
    "firearmPossession",
    "robbery",
    "anyOtherOffence",
    "oasysInterview",
    "useWeapon",
    "partner",
    "accommodation",
    "employment",
    "relationship",
    "domesticViolence",
    "currentUseOfAlcohol",
    "bingeDrinking",
    "impulsivity",
    "temper",
    "proCriminal",
    "output_sv_static",
    "output_sv_dynamic",
    "output_male_sex",
    "output_non_sex",
    "output_female_sex",
    "output_rsr_best",
    "assessmentDate"
];

function printSortedOffenderData(offender) {
  var keys = [],
  k, i, len;

  for (k in offender)
  {
      if (offender.hasOwnProperty(k))
      {
          keys.push(k);
      }
  }

  keys.sort();
  len = keys.length;
  var date_type_fields = new Array('birthDate', 'convictionDate', 'sentenceDate',
                                   'firstSanctionDate', 'assessmentDate', 'mostRecentSexualOffence');

  for (i = 0; i < len; i++)
  {
      var field_key = keys[i];
      if (FIELDS_TO_OUTPUT.indexOf(field_key) != -1) {
        try {
           var date_in_readable_format = "";
           var value = offender[field_key];
           if (field_key=='birthDate') {
            value = offender.birthDate;
           }
           if (field_key=='assessmentDate') {
            value = offender.assessmentDate;
           }
           if (date_type_fields.indexOf(field_key) != -1) {
             date_in_readable_format = " date shown: " + value;
             value = JSON.stringify(value);
           }

           console.log(field_key + " : " + value + date_in_readable_format);        }
        catch (e) {
           console.log("Error while retrieving value for " + field_key);
        }
    }
  }
};

const dateDiff = (d1, d2) => {
  var result;
  // d1 is usually the most recent, d2 the oldest e.g. d1 = 11 Jan 2013, d2 = 1 Dec 2012
  // 1 Dec 2013 - 11 Dec 2012 should return 0 years
  // Subtract years
  result = (d1.getFullYear() - d2.getFullYear());
  // Check if month diff < 0 so that the above should return 0 years diff
    // or if month is the same and date has not passed anniversary date
  if ((d1.getMonth() - d2.getMonth() < 0) || (d1.getMonth() - d2.getMonth() == 0 && d1.getDate() - d2.getDate() < 0)) {
    result --;
  }

  return result;
};

const monthDiff = (d1, d2) => {
  var result;

  result = (d1.getFullYear() - d2.getFullYear()) * 12;
  result += (d1.getMonth() - d2.getMonth());

  return parseInt(result);
}
const pickOASysInterview = (x) => parseInt(x.oasysInterview);

const calcAgeAtSanction = (x) => dateDiff(x.convictionDate, x.birthDate);
const calcAgeAtFirstSanction = (x) => dateDiff(x.firstSanctionDate, x.birthDate);
const calcYearsSinceFirstSanction = (x) => calcAgeAtSanction(x) - calcAgeAtFirstSanction(x);
const calcAgeAtRiskDate = (x) => dateDiff(x.sentenceDate, x.birthDate);
const calcSanctionOccasions = (x) => Math.min(50, parseInt(x.allSanctions) + 1);

const calcMaleAgePolynominal = (s, n) =>
  (Math.pow(n, 1) * maleaai[s]) +
  (Math.pow(n, 2) * maleaaiaai[s]) +
  (Math.pow(n, 3) * maleaaiaaiaai[s]) +
  (Math.pow(n, 4) * maleaaiaaiaaiaai[s]);

const calcfemaleAgePolynominal = (s, n) =>
  female[s] +
  (Math.pow(n, 1) * aaifemale[s]) +
  (Math.pow(n, 2) * aaiaaifemale[s]) +
  (Math.pow(n, 3) * aaiaaiaaifemale[s]) +
  (Math.pow(n, 4) * aaiaaiaaiaaifemale[s]);

const calcAgePolynominal = (x, s) => {
  switch (x.sex) {
    case Sex.Male: // if male
      return calcMaleAgePolynominal(s, calcAgeAtRiskDate(x));
    case Sex.Female: // if female
      return calcfemaleAgePolynominal(s, calcAgeAtRiskDate(x));
    default:
      return 0;
  }
};

const calcOGRS3SanctionOccasionsFactor = (x, s) => calcSanctionOccasions(x) * ogrs3_sanctionoccasions[s];
const calcOGRS4OffenceFactor = (x, s) => offenceCategoriesLookup[parseInt(x.currentOffenceType)][s];
const calcVATPFactor = (x, s) => (x.currentOffenceType === 18) ? vatpLookup[parseInt(x.violentOffenceCategory)][s] : 0;

const calcFirstSanctionFactor = (x, s) => firstsanction[s];

const calcMaleSecondSanctionFactor = (x, s) =>
  secondsanction[s] + calcYearsSinceFirstSanction(x) * malesecondsanctionyearssincefirs[s];

const calcFemaleSecondSanctionFactor = (x, s) =>
  secondsanction[s] + calcYearsSinceFirstSanction(x) * femalesecondsanctionyearssincefi[s];

const calcSecondSanctionFactor = (x, s) => {
  switch (x.sex) {
    case 0:
      return calcMaleSecondSanctionFactor(x, s);
    case 1:
      return calcFemaleSecondSanctionFactor(x, s);
    default:
      return 0;
  }
}

const calcAdditionalSanctionFactor = (x, s) => {
  var sanctionoccasions = calcSanctionOccasions(x);
  var ogrs4v_length_general = calcYearsSinceFirstSanction(x) + 12;
  var ogrs4v_rate_general = Math.log(sanctionoccasions / ogrs4v_length_general);

  switch (x.sex) {
    case 0:
      return ogrs4v_rate_general * malethreeplussanctionsogrs4v_rat[s];
    case 1:
      return ogrs4v_rate_general * femalethreeplussanctionsogrs4v_r[s];
    default:
      return 0;
  }
}

const calcNumberOfSanctionsFactor = (x, s) => {
  switch (calcSanctionOccasions(x)) {
    case 1: // 1 sanction
      return calcFirstSanctionFactor(x, s);
    break;
    case 2:  // 2 total sanctions
      return calcSecondSanctionFactor(x, s);
    break;
    default:  // 3+ total sanctions
      return calcAdditionalSanctionFactor(x, s);
    break;
  }
};

const calcOffenderOfm = (x) => Math.min(36, parseInt(monthDiff(x.assessmentDate, x.sentenceDate)));
const calcOfmPolynomial = (x, s) =>
  ((n) => Math.pow(n, 1) * ofm[s] +
          Math.pow(n, 2) * ofmofm[s] +
          Math.pow(n, 3) * ofmofmofm[s] +
          Math.pow(n, 4) * ofmofmofmofm[s])(calcOffenderOfm(x, s));


const calcViolentSanctionsFactor = (x, s) => {
  var vs = parseInt(x.violentSanctions);
  if (vs > 0) {
    // if previous violent offences
    var out = (vs * ogrs3_ovp_sanct[s]);
    out += (vs === 1 ? onceviolent[s] : 0); // if one violent sanction

    var ogrs4v_length_violent_val = calcYearsSinceFirstSanction(x) + 30;
    return out + Math.log(vs / ogrs4v_length_violent_val) * ogrs4v_rate_violent[s];
  }

  switch (x.sex) { // if male or female
    case 0:
      return maleneverviolent[s];
    case 1:
      return femaleneverviolent[s];
  }

  return 0;
}

const calcOASysFactor = (o, s) => {
  var oasys = 0;

  if (s == 0) {
    if (o.murder == "0") {
      oasys += pasthomicide;
      //console.log("pasthomicide: " + pasthomicide);
    }
    if (o.wounding == "0") {
      oasys += pastwoundinggbh;
      //console.log("pastwoundinggbh: " + pastwoundinggbh);
    }
    if (o.burglary == "0") {
      oasys += pastaggrburg;
      //console.log("pastaggrburg: " + pastaggrburg);
    }
    if (o.arson == "0") {
      oasys += pastarson;
      //console.log("pastarson: " + pastarson);
    }
    if (o.endagerLife == "0") {
      oasys += pastcdlife;
      //console.log("pastcdlife: " + pastcdlife);
    }
    if (o.kidnapping == "0") {
      oasys += pastkidnap;
      //console.log("pastkidnap: " + pastkidnap);
    }
    if (o.firearmPossession == "0") {
      oasys += pastfirearm;
      //console.log("pastfirearm: " + pastfirearm);
    }
    if (o.robbery == "0") {
      oasys += pastrobbery;
      //console.log("pastrobbery: " + pastrobbery);
    }
    if (o.anyOtherOffence == "0") {
      oasys += pastweapon;
      //console.log("pastweapon: " + pastweapon);
    }
    if (o.useWeapon == "0") {
      oasys += S2Q2A;
      //console.log("S2Q2A: " + S2Q2A);
    }

    if (o.accommodation != "" && o.accommodation != null) {
      oasys += parseInt(o.accommodation) * S3Q4;
      //console.log("accommodation: " + parseInt(o.accommodation) * S3Q4);
    }
    if (o.employment == "0") {
      oasys += 2*S4Q2;
      //console.log("employment: " + 2*S4Q2);
    }
    if (o.relationship != "" && o.relationship != null) {
      oasys += parseInt(o.relationship) * S6Q4;
      //console.log("relationship: " + parseInt(o.relationship) * S6Q4);
    }
    if (o.domesticViolence == "0") {
      oasys += S6Q7_PERP;
      //console.log("S6Q7_PERP: " + S6Q7_PERP);
    }
    if (o.currentUseOfAlcohol != "" && o.currentUseOfAlcohol != null) {
      oasys += parseInt(o.currentUseOfAlcohol) * S9Q1;
      //console.log("currentUseOfAlcohol: " + parseInt(o.currentUseOfAlcohol) * S9Q1);
    }
    if (o.bingeDrinking != "" && o.bingeDrinking != null) {
      oasys += parseInt(o.bingeDrinking) * S9Q2;
      //console.log("bingeDrinking: " + parseInt(o.bingeDrinking) * S9Q2);
    }
    if (o.impulsivity != "" && o.impulsivity != null) {
      oasys += parseInt(o.impulsivity) * S11Q2;
      //console.log("impulsivity: " + parseInt(o.impulsivity) * S11Q2);
    }
    if (o.temper != "" && o.temper != null) {
      oasys += parseInt(o.temper) * S11Q4;
      //console.log("temper: " + parseInt(o.temper) * S11Q4);
    }
    if (o.proCriminal != "" && o.proCriminal != null) {
      oasys += parseInt(o.proCriminal) * S12Q1;
      //console.log("proCriminal: " + parseInt(o.proCriminal) * S12Q1);
    }
  }

  return oasys;
}


const calculateScore = (o) => {
  var s = pickOASysInterview(o);

  var score =
    calcAgePolynominal(o, s) +
    calcOGRS4OffenceFactor(o, s) +
    calcVATPFactor(o, s) +
    calcOGRS3SanctionOccasionsFactor(o, s) +
    calcNumberOfSanctionsFactor(o, s) +
    calcOfmPolynomial(o, s) +
    calcViolentSanctionsFactor(o, s) +
    calcOASysFactor(o, s);

  // Probability of non sexual violence
  var probabilityNonSexualViolenceY1 = (Math.exp(Intercept_1[s] + score)) / (1 + (Math.exp(Intercept_1[s] + score)));
  var probabilityNonSexualViolenceY2 = (Math.exp(Intercept_2[s] + score)) / (1 + (Math.exp(Intercept_2[s] + score)));

  // Probability of sexual violence
  var totalRSRY1 = 0;
  var totalRSRY2 = 0;

  // todo: check logic
  if (o.sexualOffenceHistory == "1" && o.sexualElement == "1") { // if no sexual element or previous sexual offences (i.e. non-sexual offender)

    totalRSRY1 = probabilityNonSexualViolenceY1;
    totalRSRY2 = probabilityNonSexualViolenceY2;

  }
  if (o.sexualOffenceHistory == "0" || o.sexualElement == "0") {  // if either sexual element or previous sexual offences (i.e. sexual offender)

     var indecentImageProbabilityY1 = 0;
     var indecentImageProbabilityY2 = 0;
     if (o.sex == "1") { // if female
      indecentImageProbabilityY1 = 0;
      indecentImageProbabilityY2 = 0;
    } else if (o.indecentImage + o.contactChild + o.contactAdult + o.paraphilia == 0) { // if no previous sexual offences
        indecentImageProbabilityY1=0.000098;
        indecentImageProbabilityY2=0.000152;
    } else if (parseInt(o.indecentImage) > 1) {
        indecentImageProbabilityY1=0.038087;
        indecentImageProbabilityY2=0.057949;
    } else if (parseInt(o.indecentImage) == 1) {
        indecentImageProbabilityY1=0.018237;
        indecentImageProbabilityY2=0.02805;
    } else if (parseInt(o.contactChild) > 1) {
        indecentImageProbabilityY1=0.004615;
        indecentImageProbabilityY2=0.007151;
    } else if (parseInt(o.contactChild) == 1) {
        indecentImageProbabilityY1=0.00224;
        indecentImageProbabilityY2=0.003476;
    } else {
        indecentImageProbabilityY1=0.000683;
        indecentImageProbabilityY2=0.001061;
    }

    // Calculate OSPscore
    var OSPscore = 0;

    if (parseInt(o.contactAdult) == 0) {
      OSPscore += 0;
      //console.log('OSPscore contactAdult = 0: ' + OSPscore);
    } else if (parseInt(o.contactAdult) == 1) {
      OSPscore += 3;
      //console.log('OSPscore contactAdult = 1: ' + OSPscore);
    } else if (parseInt(o.contactAdult) == 2) {
      OSPscore += 5;
      //console.log('OSPscore contactAdult = 2: ' + OSPscore);
    } else if (parseInt(o.contactAdult) > 2) {
      OSPscore += 8;
      //console.log('OSPscore contactAdult > 2: ' + OSPscore);
    }

    if (parseInt(o.contactChild) == 0) {
      OSPscore += 0;
      //console.log('OSPscore contactChild = 0: ' + OSPscore);
    } else if (parseInt(o.contactChild) == 1) {
      OSPscore += 2;
      //console.log('OSPscore contactChild = 1: ' + OSPscore);
    } else if (parseInt(o.contactChild) == 2) {
      OSPscore += 3;
      //console.log('OSPscoren contactChild = 2: ' + OSPscore);
    } else if (parseInt(o.contactChild) > 2) {
      OSPscore += 4;
      //console.log('OSPscore contactChild > 2: ' + OSPscore);
    }

    if (parseInt(o.paraphilia) == 0) {
      OSPscore += 0;
      //console.log('OSPscore paraphilia = 0: ' + OSPscore);
    } else if (parseInt(o.paraphilia) == 1) {
      OSPscore += 1;
      //console.log('OSPscore paraphilia = 1: ' + OSPscore);
    } else if (parseInt(o.paraphilia) == 2) {
      OSPscore += 2;
      //console.log('OSPscore paraphilia = 2: ' + OSPscore);
    } else if (parseInt(o.paraphilia) > 2) {
      OSPscore += 3;
      //console.log('OSPscore paraphilia > 2: ' + OSPscore);
    }

    if (parseInt(o.allSanctions) > 0) {
      OSPscore += 3;
      //console.log('OSPscore allSanctions > 0: ' + OSPscore);
    }
    if (o.strangerVictim == '0') {
      OSPscore += 2;
      //console.log('OSPscore strangerVictim = 0: ' + OSPscore);
    }

    var ageAtMostRecentSexOffence = dateDiff(o.mostRecentSexualOffence, o.birthDate);
    if (ageAtMostRecentSexOffence > 17) {
      //console.log('OSPscore age > 17: ' + OSPscore);
      OSPscore += 5;
    } else if (ageAtMostRecentSexOffence > 15) {
      //console.log('OSPscore age > 15: ' + OSPscore);
      OSPscore += 3;
    } else if (ageAtMostRecentSexOffence > 9) {
      //console.log('OSPscore age > 9: ' + OSPscore);
      OSPscore += 0;
    }

    var ageAtRiskDate = calcAgeAtRiskDate(o);
    if (ageAtRiskDate > 59) {
      //console.log('OSPscore age at risk 59: ' + OSPscore);
      OSPscore += 0;
    } else if (ageAtRiskDate > 53) {
      //console.log('OSPscore age at risk 53: ' + OSPscore);
      OSPscore += 1;
    } else if (ageAtRiskDate > 47) {
      //console.log('OSPscore age at risk 47: ' + OSPscore);
      OSPscore += 2;
    } else if (ageAtRiskDate > 41) {
      //console.log('OSPscore age at risk 41: ' + OSPscore);
      OSPscore += 3;
    } else if (ageAtRiskDate > 35) {
      //console.log('OSPscore age at risk 35: ' + OSPscore);
      OSPscore += 4;
    } else if (ageAtRiskDate > 29) {
      //console.log('OSPscore age at risk 29: ' + OSPscore);
      OSPscore += 5;
    } else if (ageAtRiskDate > 23) {
      //console.log('OSPscore age at risk 23: ' + OSPscore);
      OSPscore += 6;
    } else if (ageAtRiskDate > 9) {
      //console.log('OSPscore age at risk 9: ' + OSPscore);
      OSPscore += 7;
    }

    // Contact sexual probability
    var contactSexualProbabilityY1 = 0;
    var contactSexualProbabilityY2 = 0;
    if (o.sex == "0") { // if male
      var z1 = -8.817398615 + (0.2545385404 * OSPscore);
      var z2 = -8.216503478 + (0.2545385404 * OSPscore);
      contactSexualProbabilityY1 = Math.exp(z1) / (1 + Math.exp(z1));
      contactSexualProbabilityY2 = Math.exp(z2) / (1 + Math.exp(z2));
    } else if (o.sex == "1") { // if female
      contactSexualProbabilityY1 = 1 / 193;
      contactSexualProbabilityY2 = 1 / 193;
    }

    totalRSRY1 = probabilityNonSexualViolenceY1 + indecentImageProbabilityY1 + contactSexualProbabilityY1;
    totalRSRY2 = probabilityNonSexualViolenceY2 + indecentImageProbabilityY2 + contactSexualProbabilityY2;
  }

  // todo: return yr1 and yr2

  return totalRSRY2;
};


   // public

module.exports = {
  calculateScore: calculateScore,
  printSortedOffenderData: printSortedOffenderData
};
