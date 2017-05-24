
const validWeightValue = (x) => x !== '' && x != null;
const factorIfValidWeight = (x, n) => validWeightValue(x) ? x * (n || 0) : 0;
const isApplicable = (x) => !x ? 1 : 0;
const factorIfValidNumeric = (x, n) => isApplicable(x) * (n || 0);

const withCompletedOASysInterview = (x) =>
  factorIfValidNumeric(x.murder, x.coefficients.PastHomicide) +
  factorIfValidNumeric(x.wounding, x.coefficients.PastWoundingGBH) +
  factorIfValidNumeric(x.burglary, x.coefficients.PastAggresiveBurglary) +
  factorIfValidNumeric(x.arson, x.coefficients.PastArson) +
  factorIfValidNumeric(x.endagerLife, x.coefficients.PastCDLife) +
  factorIfValidNumeric(x.kidnapping, x.coefficients.PastKidnap) +
  factorIfValidNumeric(x.firearmPossession, x.coefficients.PastFirearm) +
  factorIfValidNumeric(x.robbery, x.coefficients.PastRobbery) +
  // todo: validate this is correct as badly named
  factorIfValidNumeric(x.anyOtherOffence, x.coefficients.PastWeapon) +
  factorIfValidNumeric(x.useWeapon, x.coefficients.S2Q2A) +
  factorIfValidWeight(x.accommodation, x.coefficients.S3Q4) +
  // todo: why is this not a weighted factor
  factorIfValidNumeric(x.employment, 2 * x.coefficients.S4Q2) +
  factorIfValidWeight(x.relationship, x.coefficients.S6Q4) +
  factorIfValidNumeric(x.domesticViolence, x.coefficients.S6Q7_PERP) +
  factorIfValidWeight(x.currentUseOfAlcohol, x.coefficients.S9Q1) +
  factorIfValidWeight(x.bingeDrinking, x.coefficients.S9Q2) +
  factorIfValidWeight(x.impulsivity, x.coefficients.S11Q2) +
  factorIfValidWeight(x.temper, x.coefficients.S11Q4) +
  factorIfValidWeight(x.proCriminal, x.coefficients.S12Q1);

const calculateOASysPolynomial = (x) =>
    x.hasHadOASysInterview ? withCompletedOASysInterview(x) : 0;

const withInputs = (fn) => (x) =>
  fn({
    hasHadOASysInterview: x.oasysInterview === 0,
    coefficients: x.coefficients,
    murder: x.murder,
    wounding: x.wounding,
    burglary: x.burglary,
    arson: x.arson,
    endagerLife: x.endagerLife,
    kidnapping: x.kidnapping,
    firearmPossession: x.firearmPossession,
    robbery: x.robbery,
    anyOtherOffence: x.anyOtherOffence,
    useWeapon: x.useWeapon,
    accommodation: x.accommodation,
    employment: x.employment,
    relationship: x.relationship,
    domesticViolence: x.domesticViolence,
    currentUseOfAlcohol: x.currentUseOfAlcohol,
    bingeDrinking: x.bingeDrinking,
    impulsivity: x.impulsivity,
    temper: x.temper,
    proCriminal: x.proCriminal,
  });

// public

module.exports = withInputs(calculateOASysPolynomial);
