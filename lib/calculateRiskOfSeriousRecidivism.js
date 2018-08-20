
const calcRiskOfSeriousRecidivism = (x) =>
  x.probabilityOfNonSexualViolence.map((n, i) =>
    n +
    x.indecentImageProbability[i] +
    x.offenderSexualProbability[i]
  );

// public

module.exports = (x) =>
  calcRiskOfSeriousRecidivism({
    probabilityOfNonSexualViolence: x.probabilityOfNonSexualViolence,
    indecentImageProbability: x.indecentImageProbability,
    offenderSexualProbability: x.offenderSexualProbability,
  });
