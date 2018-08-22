
// helpers

// logistic regression function
const logisticCurve = n => (ex => ex / (1 + ex))(Math.exp(n));

// private methods

const maleOSP = staticScore =>
  [
    -8.817398615,
    -8.216503478
  ]
  .map(n => logisticCurve(n + (0.2545385404 * staticScore)));

const femaleOSP = () =>
  [1 / 193, 1 / 193];

// public methods

const calculateOffenderSexualProbability = x =>
  x.hasSexualElementOrOffence ? (x.isMale ? maleOSP(x.OSPStaticScore) : femaleOSP()) : [0, 0];

// public
module.exports = x =>
  calculateOffenderSexualProbability({
    isMale: x.isMale,
    hasSexualElementOrOffence: x.hasSexualElementOrOffence,

    OSPStaticScore: x.OSPStaticScore,
  });
