
const calcRiskOfSeriousRecidivism = x =>
  x.probabilityOfNonSexualViolence
    .map((sv, i) => sv + x.offenderSexualProbability[i] + x.indecentImageProbability[i]);

// public

module.exports = (x) =>
  calcRiskOfSeriousRecidivism({
    probabilityOfNonSexualViolence: x.probabilityOfNonSexualViolence,
    offenderSexualProbability: x.offenderSexualProbability,
    indecentImageProbability: x.indecentImageProbability,
  });
