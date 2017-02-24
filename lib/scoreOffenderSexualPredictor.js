
const dateDiff = (d1, d2) => {
  var result = (d1.getFullYear() - d2.getFullYear());
  return ((d1.getMonth() - d2.getMonth() < 0) || (d1.getMonth() - d2.getMonth() == 0 && d1.getDate() - d2.getDate() < 0)) ? result - 1 : result;
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
const calcForStrangerVictim = (x) => (x.strangerVictim === 0) ? 2 : 0;

const calcAgeAtMostRecentSexOffence = (x) => dateDiff(x.mostRecentSexualOffence, x.birthDate);
const calcForAgeAtMostRecentSexOffence = (x) => {
  var n = calcAgeAtMostRecentSexOffence(x);

  if (n > 17) return 5;
  if (n > 15) return 3;
  if (n > 9) return 0;
  return 0;
}

const calcAgeAtRiskDate = (x) => dateDiff(x.sentenceDate, x.birthDate);
const calcForAgeAtRiskDate = (x) => {
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

const withInputs = (fn) => (x) =>
  fn({
    birthDate: x.birthDate,
    sentenceDate: x.sentenceDate,
    mostRecentSexualOffence: x.mostRecentSexualOffence,
    strangerVictim: x.strangerVictim,
    allSanctions: x.allSanctions,
    paraphilia: x.paraphilia,
    contactChild: x.contactChild,
    contactAdult: x.contactAdult,
  });

// public

module.exports = withInputs((x) =>
    calcForContactAdult(x) +
    calcForContactChild(x) +
    calcForParaphilia(x) +
    calcForSanctions(x) +
    calcForStrangerVictim(x) +
    calcForAgeAtMostRecentSexOffence(x) +
    calcForAgeAtRiskDate(x));
