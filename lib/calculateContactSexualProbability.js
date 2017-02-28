// dependencies
const OSPscore = require('./scoreOffenderSexualPredictor');

// helpers
const Sex = {
  Male: 0,
  Female: 1
};

// helpers
const divisionBySelfPlusOne = (x) => x / (1 + x);
const exponentialDivisionBySelfPlusOne = (x) => divisionBySelfPlusOne(Math.exp(x));

const calcMaleContactSexualProbability = (x) => {
  var score = OSPscore(x);

  return [
    exponentialDivisionBySelfPlusOne(-8.817398615 + (0.2545385404 * score)),
    exponentialDivisionBySelfPlusOne(-8.216503478 + (0.2545385404 * score)),
  ];
}

const calcFemaleContactSexualProbability = (x) =>
  [1 / 193, 1 / 193];

const withInputs = (fn) => (x) =>
  fn({
    hasNoSexualElementOrOffence: x.sexualOffenceHistory + x.sexualElement === 2,
    sex: x.sex,                                         // 0 = male, 1 = female
    contactChild: x.contactChild,                       // 0,1
    contactAdult: x.contactAdult,                       // 0,1
    paraphilia: x.paraphilia,                           // 0,1
    allSanctions: x.allSanctions,                       // 1+
    strangerVictim: x.strangerVictim,                   // 0,1
    birthDate: x.birthDate,                             // Date
    sentenceDate: x.sentenceDate,                       // Date
    mostRecentSexualOffence: x.mostRecentSexualOffence, // Date
  });

// public
module.exports = withInputs((x) => {
  if (x.hasNoSexualElementOrOffence) return [0, 0];

  switch (x.sex) {
    case Sex.Male: return calcMaleContactSexualProbability(x);
    case Sex.Female: return calcFemaleContactSexualProbability(x);
    default: return [0, 0];
  }
});
