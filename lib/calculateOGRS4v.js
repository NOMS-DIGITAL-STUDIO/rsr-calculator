
const calcWithNoViolentSanctionsFactor = (x) =>
  x.isMale ? x.maleneverviolent : x.femaleneverviolent;

// OGRS => Offender Group Reconviction Scale
const calcWithViolentSanctionsFactor = (x) =>
  (x.violentSanctions * x.ogrs3_ovp_sanct) +
  (x.violentSanctions === 1 ? x.onceviolent : 0) +
  (Math.log(x.violentSanctions / (x.yearsSinceFirstSanction + 30)) * x.ogrs4v_rate_violent_parameter_estimate);

const calcOGRS4v = (x) =>
  (x.violentSanctions === 0) ?
    calcWithNoViolentSanctionsFactor(x) :
    calcWithViolentSanctionsFactor(x);

// public

module.exports = (x) =>
  calcOGRS4v({
    ogrs3_ovp_sanct: x.coefficients.ogrs3_ovp_sanct,
    onceviolent: x.coefficients.onceviolent,
    ogrs4v_rate_violent_parameter_estimate: x.coefficients.ogrs4v_rate_violent_parameter_estimate,
    maleneverviolent: x.coefficients.maleneverviolent,
    femaleneverviolent: x.coefficients.femaleneverviolent,

    // Number of previous sanctions for all recordable offences
    violentSanctions: parseInt(x.violentSanctions || 0, 10),

    isMale: x.isMale,
    yearsSinceFirstSanction: x.yearsSinceFirstSanction,
  });
