const Sex = {
  Male: 0,
  Female: 1
};

const dateDiff = (d1, d2) =>
  (d1.getFullYear() - d2.getFullYear()) -
  ((d1.getMonth() - d2.getMonth() < 0) || (d1.getMonth() - d2.getMonth() === 0 && d1.getDate() - d2.getDate() < 0) ? 1 : 0);

const sexBasedFactor = (maleFactor, femaleFactor, sex) => {
  switch (sex) {
    case Sex.Male: return maleFactor;
    case Sex.Female: return femaleFactor;
    default: return 0;
  }
};

const calcAgeAtSanction = (x) => dateDiff(x.convictionDate, x.birthDate);
const calcAgeAtFirstSanction = (x) => dateDiff(x.firstSanctionDate, x.birthDate);
const calcYearsSinceFirstSanction = (x) => calcAgeAtSanction(x) - calcAgeAtFirstSanction(x);


// OGRS => Offender Group Reconviction Scale
const calcWithViolentSanctionsFactor = (x) =>
  (x.violentSanctions * x.ogrs3_ovp_sanct) +
  (x.violentSanctions === 1 ? x.onceviolent : 0) +
  (Math.log(x.violentSanctions / (calcYearsSinceFirstSanction(x) + 30)) * x.ogrs4v_rate_violent_parameter_estimate);

const calcWithNoViolentSanctionsFactor = (x) =>
  sexBasedFactor(x.maleneverviolent, x.femaleneverviolent, x.sex);

const calcOGRS4v = (x) =>
  (x.violentSanctions === 0) ?
    calcWithNoViolentSanctionsFactor(x) :
    calcWithViolentSanctionsFactor(x);

const withInputs = (fn) => (x) =>
  fn({
    ogrs3_ovp_sanct: x.coefficients.ogrs3_ovp_sanct,
    onceviolent: x.coefficients.onceviolent,
    ogrs4v_rate_violent_parameter_estimate: x.coefficients.ogrs4v_rate_violent_parameter_estimate,
    maleneverviolent: x.coefficients.maleneverviolent,
    femaleneverviolent: x.coefficients.femaleneverviolent,

    // Number of previous sanctions for all recordable offences
    violentSanctions: parseInt(x.violentSanctions || 0, 10),
    sex: x.sex,

    // key dates
    birthDate: x.birthDate,
    convictionDate: x.convictionDate,
    firstSanctionDate: x.firstSanctionDate,
  });

// public

module.exports = withInputs(calcOGRS4v);
