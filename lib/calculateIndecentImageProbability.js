
// helpers
const Sex = {
  Male: 0,
  Female: 1
};

const hasNoSexualElementOrOffence = (x) => x.sexualOffenceHistory + x.sexualElement === 2;

// public

const withInputs = (fn) => (x) =>
  fn({
    sex: x.sex,
    indecentImage: x.indecentImage,
    paraphilia: x.paraphilia,
    contactChild: x.contactChild,
    contactAdult: x.contactAdult,
    sexualOffenceHistory: x.sexualOffenceHistory,
    sexualElement: x.sexualElement,
  });

module.exports = withInputs((x) => {
  if (hasNoSexualElementOrOffence(x) || x.sex === Sex.Female) return [0, 0];

   // if no current or previous sexual offences
  if (x.indecentImage + x.contactChild + x.contactAdult + x.paraphilia == 0) return [0.000098, 0.000152];

  // if current or previous sexual offences
  if (x.indecentImage > 1) return [0.038087, 0.057949];
  if (x.indecentImage == 1) return [0.018237, 0.02805];
  if (x.contactChild > 1) return [0.004615, 0.007151];
  if (x.contactChild == 1) return [0.00224, 0.003476];
  return [0.000683, 0.001061];
});
