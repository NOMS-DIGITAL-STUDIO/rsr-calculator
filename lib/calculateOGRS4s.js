
// helpers
const Sex = {
  Male: 0,
  Female: 1
};

const calcForContactAdult = (x) => {
  var n = x.contactAdult;

  if (n === 1) return 3;
  if (n === 2) return 5;
  if (n > 2) return 8;
  return 0;
};

const calcForContactChild = (x) => {
  var n = x.contactChild;

  if (n === 1) return 2;
  if (n === 2) return 3;
  if (n > 2) return 4;
  return 0;
};

const calcForParaphilia = (x) => {
  var n = x.paraphilia;

  if (n === 1) return 1;
  if (n === 2) return 2;
  if (n > 2) return 3;
  return 0;
};

const calcForSanctions = (x) => (x.allSanctions > 0) ? 3 : 0;
const calcForStrangerVictim = (x) => (x.strangerVictim) ? 2 : 0;

const calcForAgeAtMostRecentSexOffence = (x) => {
  var n = x.ageAtMostRecentSexOffence;

  if (n > 17) return 5;
  if (n > 15) return 3;
  if (n > 9) return 0;
  return 0;
}

const calcForAgeAtSentenceDateDate = (x) => {
  var n = x.ageAtSentenceDate;

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

const dateDiff = (d1, d2) =>
  (d1.getFullYear() - d2.getFullYear()) -
  ((d1.getMonth() - d2.getMonth() < 0) || (d1.getMonth() - d2.getMonth() == 0 && d1.getDate() - d2.getDate() < 0) ? 1 : 0);

const hasNoSexualElementOrOffence = (x) =>
  x.sexualOffenceHistory + x.sexualElement === 2;

const onlyForMaleSexOffenders = (fn) => (x) =>
  x.sex !== Sex.Male || hasNoSexualElementOrOffence(x) ? 0 : fn(x);

const calculateOGRS4s = (x) =>
  calcForContactAdult(x) +
  calcForContactChild(x) +
  calcForParaphilia(x) +
  calcForSanctions(x) +
  calcForStrangerVictim(x) +
  calcForAgeAtMostRecentSexOffence(x) +
  calcForAgeAtSentenceDateDate(x);

const withInputs = (fn) => (x) =>
  fn({
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
    ageAtSentenceDate: dateDiff(x.sentenceDate, x.birthDate),
    ageAtMostRecentSexOffence: dateDiff(x.mostRecentSexualOffence, x.birthDate),
  });

// public

module.exports = onlyForMaleSexOffenders(withInputs(calculateOGRS4s));

// OGRS4s risk band = 0-11 = low, 12-14 = medium, 15-17 = high, 18+ V. High
