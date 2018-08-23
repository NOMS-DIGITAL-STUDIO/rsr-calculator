
const calcRiskOfSeriousRecidivism = x =>
  x.nonSexualViolenceProbability
    .map((sv, i) => sv + x.offenderSexualProbability[i] + x.indecentImageProbability[i]);

// public

module.exports = (x) =>
  calcRiskOfSeriousRecidivism({
    nonSexualViolenceProbability: x.nonSexualViolenceProbability,
    offenderSexualProbability: x.offenderSexualProbability,
    indecentImageProbability: x.indecentImageProbability,
  });
