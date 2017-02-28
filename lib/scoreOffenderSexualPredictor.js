
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
const calcForStrangerVictim = (x) => (x.strangerVictim === 0) ? 2 : 0;

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

const dateDiff = (d1, d2) => {
  var result = (d1.getFullYear() - d2.getFullYear());
  return ((d1.getMonth() - d2.getMonth() < 0) || (d1.getMonth() - d2.getMonth() == 0 && d1.getDate() - d2.getDate() < 0)) ? result - 1 : result;
};

const withInputs = (fn) => (x) =>
  fn({
    contactChild: x.contactChild,                             // 0,1
    contactAdult: x.contactAdult,                             // 0,1
    paraphilia: x.paraphilia,                                 // 0,1
    allSanctions: x.allSanctions,                             // 0,1
    strangerVictim: x.strangerVictim,                         // 0,1
    ageAtSentenceDate: dateDiff(x.sentenceDate, x.birthDate),
    ageAtMostRecentSexOffence: dateDiff(x.mostRecentSexualOffence, x.birthDate),
  });

// public

module.exports = withInputs((x) =>
    calcForContactAdult(x) +
    calcForContactChild(x) +
    calcForParaphilia(x) +
    calcForSanctions(x) +
    calcForStrangerVictim(x) +
    calcForAgeAtMostRecentSexOffence(x) +
    calcForAgeAtSentenceDateDate(x));
