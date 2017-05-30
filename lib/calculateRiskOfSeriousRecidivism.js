
const calcRiskOfSeriousRecidivism = (x) =>
  x.probabilityOfNonSexualViolence.map((n, i) => n + x.indecentImageProbability[i] + x.contactSexualProbability[i]);

const withInputs = (fn) => (x) =>
  fn({
    probabilityOfNonSexualViolence: x.probabilityOfNonSexualViolence,
    indecentImageProbability: x.indecentImageProbability,
    contactSexualProbability: x.contactSexualProbability,
  });

// public

module.exports = withInputs(calcRiskOfSeriousRecidivism);
