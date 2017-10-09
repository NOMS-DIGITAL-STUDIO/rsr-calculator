
// helpers
const Sex = {
  Male: 0,
  Female: 1
};

const dateDiff = (d1, d2) =>
  (d1.getFullYear() - d2.getFullYear()) -
  ((d1.getMonth() - d2.getMonth() < 0) || (d1.getMonth() - d2.getMonth() === 0 && d1.getDate() - d2.getDate() < 0) ? 1 : 0);

const calcForContactAdult = (n) =>
  (n === 1) ? 3 : (n === 2) ? 5 : (n > 2) ? 8 : 0;

const calcForContactChild = (n) =>
  (n === 1) ? 2 : (n === 2) ? 3 : (n > 2) ? 4: 0;

const calcForParaphilia = (n) => Math.min(3, n || 0);
const calcForSanctions = (n) => (n > 0) ? 3 : 0;
const calcForStrangerVictim = (n) => (n) ? 2 : 0;

const calcForAgeAtMostRecentSexOffence = (n) =>
  (n > 17) ? 5 : (n > 15) ? 3 : (n > 9) ? 0 : 0;

const calcForAgeAtSentenceDate = (n) =>
  (n > 59) ? 0 : (n > 53) ? 1 : (n > 47) ? 2 : (n > 41) ? 3 : (n > 35) ? 4 : (n > 29) ? 5 : (n > 23) ? 6 : (n > 9) ? 7 : 0;

const forMaleSexOffenders = (x) =>
  calcForContactAdult(x.contactAdult) +
  calcForContactChild(x.contactChild) +
  calcForParaphilia(x.paraphilia) +
  calcForSanctions(x.previousSanctions) +
  calcForStrangerVictim(x.strangerVictim) +
  calcForAgeAtMostRecentSexOffence(x.ageAtMostRecentSexOffence) +
  calcForAgeAtSentenceDate(x.ageAtSentenceDate);

const calculateOGRS4s = (x) =>
  x.isMale && x.hasSexualElementOrOffence ? forMaleSexOffenders(x) : 0;

const withInputs = (fn) => (x) => {
  let y = {
    isMale: x.sex === Sex.Male,
    hasSexualElementOrOffence: x.sexualOffenceHistory + x.sexualElement !== 2,
    // current sexual offence has a stranger victim
    strangerVictim: x.strangerVictim === 0,                   // 0 = yes, 1 = no
    // Number of previous sanctions for all recordable offences
    previousSanctions: parseInt(x.previousSanctions || 0, 10),
    // Number of previous/ current sanctions involving contact child sexual offences
    contactChild: parseInt(x.contactChild || 0, 10),
    // Number of previous/ current sanctions involving contact adult sexual offences
    contactAdult: parseInt(x.contactAdult || 0, 10),
    // Number of previous / current sanctions involving paraphilia sexual offences
    paraphilia: parseInt(x.paraphilia || 0, 10),

    ageAtSentenceDate: dateDiff(x.sentenceDate, x.birthDate),
  };

  if (y.isMale && y.hasSexualElementOrOffence) {
    y.ageAtMostRecentSexOffence = dateDiff(x.mostRecentSexualOffence, x.birthDate);
  }

  return fn(y);
};

// public

module.exports = withInputs(calculateOGRS4s);
