// dependencies
const OSPscore = require('./scoreOffenderSexualPredictor');

// helpers
const Sex = {
  Male: 0,
  Female: 1
};

// helpers
const hasNoSexualElementOrOffence = (x) => x.sexualOffenceHistory + x.sexualElement === 2;

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

// public
module.exports = (x) => {
  if (hasNoSexualElementOrOffence(x)) return [0, 0];

  switch (x.sex) {
    case Sex.Male: return calcMaleContactSexualProbability(x);
    case Sex.Female: return calcFemaleContactSexualProbability(x);
    default: return [0, 0];
  }
};