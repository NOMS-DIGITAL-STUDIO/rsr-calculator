
const withInputs = (fn) => (x) =>
  fn({
    probabilityOfNonSexualViolence: x.probabilityOfNonSexualViolence,
    indecentImageProbability: x.indecentImageProbability,
    contactSexualProbability: x.contactSexualProbability,
  });

// public

module.exports = (x) =>
  x.probabilityOfNonSexualViolence.map((n, i) => n + x.indecentImageProbability[i] + x.contactSexualProbability[i]);
