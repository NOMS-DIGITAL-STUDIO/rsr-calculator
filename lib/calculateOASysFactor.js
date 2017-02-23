//OASys
const S2Q2A = 0.15071282416667;
const S3Q4 = 0.0619710049121293;
const S4Q2 = 0.0389109699626767;
const S6Q4 = 0.0259107268767618;
const S9Q1 = 0.0935672441515258;
const S9Q2 = 0.0567127896345591;
const S11Q2 = 0.077212834605957;
const S11Q4 = 0.0482892034688302;
const S12Q1 = 0.130830533773332;
const S6Q7_PERP = 0.0847839330659903;
const pasthomicide = 0.399463399258737;
const pastwoundinggbh = 0.451029720739399;
const pastkidnap = 0.0749101406070305;
const pastfirearm = 0.218055028351022;
const pastrobbery = 0.163248217650296;
const pastaggrburg = 0.506616685297771;
const pastweapon = 0.184104582611966;
const pastcdlife = 0.357345708081477;
const pastarson = 0.12261588608151;

const pickOASysInterview = (x) => x.oasysInterview;

const validWeightValue = (x) => x != "" && x != null;
const factorIfValidWeight = (x, n) => validWeightValue(x) ? x * n : 0;
const validNumericValue = (x) => x === 0;
const factorIfValidNumeric = (x, n) => validNumericValue(x) ? n : 0;

const sumOASysFactors = (x) =>
  factorIfValidNumeric(x.murder, pasthomicide) +
  factorIfValidNumeric(x.wounding, pastwoundinggbh) +
  factorIfValidNumeric(x.burglary, pastaggrburg) +
  factorIfValidNumeric(x.arson, pastarson) +
  factorIfValidNumeric(x.endagerLife, pastcdlife) +
  factorIfValidNumeric(x.kidnapping, pastkidnap) +
  factorIfValidNumeric(x.firearmPossession, pastfirearm) +
  factorIfValidNumeric(x.robbery, pastrobbery) +
  // todo: validate this is correct as badly named
  factorIfValidNumeric(x.anyOtherOffence, pastweapon) +
  factorIfValidNumeric(x.useWeapon, S2Q2A) +
  factorIfValidWeight(x.accommodation, S3Q4) +
  // todo: why is this not a weighted factor
  factorIfValidNumeric(x.employment, 2 * S4Q2) +
  factorIfValidWeight(x.relationship, S6Q4) +
  factorIfValidNumeric(x.domesticViolence, S6Q7_PERP) +
  factorIfValidWeight(x.currentUseOfAlcohol, S9Q1) +
  factorIfValidWeight(x.bingeDrinking, S9Q2) +
  factorIfValidWeight(x.impulsivity, S11Q2) +
  factorIfValidWeight(x.temper, S11Q4) +
  factorIfValidWeight(x.proCriminal, S12Q1);

// public

module.exports = (x) =>
  (pickOASysInterview(x) !== 0) ? 0 : sumOASysFactors(x);
