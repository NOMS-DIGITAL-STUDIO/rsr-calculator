
const calcRiskOfSeriousRecidivism = (x) =>
  /*
    (x.SVStaticScore[0] || x.SVDynamicScore[0] || 0) +
    (x.MaleSexScore[0] || x.FemaleSexScore[0] || 0) +      // Male OSP || Female OSP
    (x.IndecentImagesScore[0] || 0)                        // IIP
  */
  x.probabilityOfNonSexualViolence.map((n, i) =>
    n +                                             //
    x.indecentImageProbability[i] +                 // IIP
    x.offenderSexualProbability[i]                  // Male OSP || Female OSP
  );

// public

module.exports = (x) =>
  calcRiskOfSeriousRecidivism({
    probabilityOfNonSexualViolence: x.probabilityOfNonSexualViolence,
    indecentImageProbability: x.indecentImageProbability,
    offenderSexualProbability: x.offenderSexualProbability,
  });
