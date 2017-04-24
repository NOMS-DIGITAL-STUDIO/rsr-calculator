
// helpers
const calcSanctionOccasions = (x) => Math.min(50, x.allSanctions + 1);

const calcOGRS3 = (x) =>
  calcSanctionOccasions(x) * x.ogrs3_sanctionoccasions;

const withInputs = (fn) => (x) =>
  fn({
    ogrs3_sanctionoccasions: x.coefficients.ogrs3_sanctionoccasions,
    // Number of previous sanctions for all recordable offences
    allSanctions: parseInt(x.allSanctions || 0, 10),
  });

// public

module.exports = withInputs(calcOGRS3);
