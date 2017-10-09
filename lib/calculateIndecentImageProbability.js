
// helpers
const Sex = {
  Male: 0,
  Female: 1
};

const calculateIndecentImageProbability = (x) => {
  if (x.hasSexualElementOrOffence && x.isMale) {
     // if no current or previous sexual offences
    if (x.hasNoCurrentOrPreviousSexualOffence) {
      return [0.000098, 0.000152];
    }

    // if current or previous sexual offences
    if (x.indecentImage > 1) return [0.038087, 0.057949];
    if (x.indecentImage === 1) return [0.018237, 0.02805];
    if (x.contactChild > 1) return [0.004615, 0.007151];
    if (x.contactChild === 1) return [0.00224, 0.003476];
    return [0.000683, 0.001061];
  }

  return [0, 0];
};

const withInputs = (fn) => (x) =>
  fn({
    isMale: x.sex === Sex.Male,
    indecentImage: x.indecentImage,                     // 0+
    contactChild: x.contactChild,                       // 0+
    hasSexualElementOrOffence: x.sexualOffenceHistory + x.sexualElement !== 2,
    hasNoCurrentOrPreviousSexualOffence: x.indecentImage + x.contactChild + x.contactAdult + x.paraphilia === 0,
  });

// public

module.exports = withInputs(calculateIndecentImageProbability);
