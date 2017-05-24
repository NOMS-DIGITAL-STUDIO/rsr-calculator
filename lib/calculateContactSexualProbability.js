
// helpers
const Sex = {
  Male: 0,
  Female: 1
};

// logistic function
const logisticCurve = (x) => ((ex) => ex / (1 + ex))(Math.exp(x));

const calcMaleContactSexualProbability = (score) =>
  [-8.817398615, -8.216503478].map((x) => logisticCurve(x + (0.2545385404 * score)));

const calcFemaleContactSexualProbability = () =>
  [1 / 193, 1 / 193];

const calculateContactSexualProbability = (x) => {
  if (x.hasSexualElementOrOffence) {
    switch (x.sex) {
      case Sex.Male: return calcMaleContactSexualProbability(x.OGRS4s);
      case Sex.Female: return calcFemaleContactSexualProbability();
    }
  }

  return [0, 0];
};

const withInputs = (fn) => (x) =>
  fn({
    hasSexualElementOrOffence: x.sexualOffenceHistory + x.sexualElement !== 2,
    sex: x.sex,                                         // 0 = male, 1 = female
    contactChild: x.contactChild,                       // 0 = yes, 1 = no
    contactAdult: x.contactAdult,                       // 0 = yes, 1 = no
    paraphilia: x.paraphilia,                           // 0 = yes, 1 = no
    allSanctions: x.allSanctions,                       // 1+
    strangerVictim: x.strangerVictim,                   // 0 = yes, 1 = no
    birthDate: x.birthDate,                             // Date
    sentenceDate: x.sentenceDate,                       // Date
    mostRecentSexualOffence: x.mostRecentSexualOffence, // Date
    OGRS4s: x.OGRS4s,
  });

// public

module.exports = withInputs(calculateContactSexualProbability);
