
// helpers
const Sex = {
  Male: 0,
  Female: 1
};

const dateDiff = (d1, d2) =>
  (d1.getFullYear() - d2.getFullYear()) -
  ((d1.getMonth() - d2.getMonth() < 0) || (d1.getMonth() - d2.getMonth() === 0 && d1.getDate() - d2.getDate() < 0) ? 1 : 0);

const calcForContactAdult = (x) => {
  var n = x.contactAdult;

  return (n === 1) ? 3 : (n === 2) ? 5 : (n > 2) ? 8 : 0;
};

const calcForContactChild = (x) => {
  var n = x.contactChild;

  return (n === 1) ? 2 : (n === 2) ? 3 : (n > 2) ? 4: 0;
};

const calcForParaphilia = (x) => {
  var n = x.paraphilia;

  return (n === 1) ? 1 : (n === 2) ? 2 : (n > 2) ? 3 : 0;
};

const calcForSanctions = (x) => (x.allSanctions > 0) ? 3 : 0;
const calcForStrangerVictim = (x) => (x.strangerVictim) ? 2 : 0;

const calcForAgeAtMostRecentSexOffence = (x) => {
  var n = dateDiff(x.mostRecentSexualOffence, x.birthDate);

  return (n > 17) ? 5 : (n > 15) ? 3 : (n > 9) ? 0 : 0;
};

const calcForAgeAtSentenceDateDate = (x) => {
  var n = dateDiff(x.sentenceDate, x.birthDate);

  return (n > 59) ? 0 : (n > 53) ? 1 : (n > 47) ? 2 : (n > 41) ? 3 : (n > 35) ? 4 : (n > 29) ? 5 : (n > 23) ? 6 : (n > 9) ? 7 : 0;
};

const forMaleSexOffenders = (x) =>
  calcForContactAdult(x) +
  calcForContactChild(x) +
  calcForParaphilia(x) +
  calcForSanctions(x) +
  calcForStrangerVictim(x) +
  calcForAgeAtMostRecentSexOffence(x) +
  calcForAgeAtSentenceDateDate(x);

const calculateOGRS4s = (x) =>
  x.isMale && x.hasSexualElementOrOffence ? forMaleSexOffenders(x) : 0;

const withInputs = (fn) => (x) =>
  fn({
    isMale: x.sex === Sex.Male,
    hasSexualElementOrOffence: x.sexualOffenceHistory + x.sexualElement !== 2,
    // current sexual offence has a stranger victim
    strangerVictim: x.strangerVictim === 0,                   // 0 = yes, 1 = no
    // Number of previous sanctions for all recordable offences
    allSanctions: parseInt(x.allSanctions || 0, 10),
    // Number of previous/ current sanctions involving contact child sexual offences
    contactChild: parseInt(x.contactChild || 0, 10),
    // Number of previous/ current sanctions involving contact adult sexual offences
    contactAdult: parseInt(x.contactAdult || 0, 10),
    // Number of previous / current sanctions involving paraphilia sexual offences
    paraphilia: parseInt(x.paraphilia || 0, 10),
    birthDate: x.birthDate,
    sentenceDate: x.sentenceDate,
    mostRecentSexualOffence: x.mostRecentSexualOffence,
  });

// public

module.exports = withInputs(calculateOGRS4s);
