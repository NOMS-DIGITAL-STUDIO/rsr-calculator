
// helpers
const Sex = {
  Male: 0,
  Female: 1
};

const calcSanctionOccasions = (x) => Math.min(50, x.allSanctions + 1);

const calcOGRS3 = (x) =>
  calcSanctionOccasions(x) * x.coefficients.ogrs3_sanctionoccasions;

const withInputs = (fn) => (x) =>
  fn({
    coefficients: x.coefficients,
    // current sexual offence has a stranger victim
    oasysInterview: x.oasysInterview,                   // 0 = yes, 1 = no
    // Number of previous sanctions for all recordable offences
    allSanctions: parseInt(x.allSanctions || 0, 10),
  });

// public

module.exports = withInputs(calcOGRS3);
