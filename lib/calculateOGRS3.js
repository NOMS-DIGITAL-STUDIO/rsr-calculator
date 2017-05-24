
// helpers
const Sex = {
  Male: 0,
  Female: 1
};

const dateDiff = (d1, d2) =>
  (d1.getFullYear() - d2.getFullYear()) -
  ((d1.getMonth() - d2.getMonth() < 0) || (d1.getMonth() - d2.getMonth() === 0 && d1.getDate() - d2.getDate() < 0) ? 1 : 0);

const offenceGroupsOGRS3 = {
  'Violence': 0,
  'Robbery': 1,
  'Public order': 2,
  'Sexual (not against child)': 3,
  'Sexual (against child)': 4,
  'Soliciting or prostitution': 5,
  'Burglary (domestic)': 6,
  'Burglary (other)': 7,
  'Theft (non-motor)': 8,
  'Handling stolen goods': 9,
  'Fraud and forgery': 10,
  'Absconding or bail offences': 11,
  'Taking & driving away and related offences': 12,
  'Theft from vehicles': 13,
  'Drink driving': 14,
  'Other motoring': 15,
  'Criminal damage': 16,
  'Drug import/export/production': 17,
  'Drug possession/supply': 18,
  'Other offence': 19
};

const calcForOffenceGroupParameter = (x) =>
  x.coefficients.OGRS3.offenceCategoriesLookup[x.offenceGroup] || 0;


const calcForAgeGroup = (x) => {
  var n = x.ageAtAssessmentDate;

  return (n > 49) ? 7 : (n > 39) ? 6 : (n > 34) ? 5 : (n > 29) ? 4 : (n > 24) ? 3 : (n > 20) ? 2 : (n > 17) ? 1 : (n > 15) ? 0 : 8;
};

const calcForAgeAndGender = (x) =>
  x.coefficients.OGRS3.ageGroupLookup[calcForAgeGroup(x)][x.sex === Sex.Male ? 0 : 1];

const calcForConvictionStatus = (x) =>
  (x.allSanctions > 0) ? x.coefficients.OGRS3.repeatOffender : x.coefficients.OGRS3.firstTimeOffender;

const calcForCopasScore = (x) =>
  x.coefficients.OGRS3.copas * Math.log((1 + x.allSanctions) / (10 + x.ageAtConvictionDate - x.ageAtFirstSanctionDate));

const calcOGRS3 = (x) => {
  var sum = calcForAgeAndGender(x) +
            calcForConvictionStatus(x) +
            calcForCopasScore(x) +
            calcForOffenceGroupParameter(x);

  return [1.40256, 2.1217].map(
    (x) => (Math.exp(x + sum) / (1 + Math.exp(x + sum)))
  );
};

const withInputs = (fn) => (x) =>
  fn({
    coefficients: x.coefficients,

    sex: x.sex,
    offenceGroupsOGRS3: x.offenceGroup,
    allSanctions: Math.min(50, x.allSanctions || 0),
    ageAtConvictionDate: dateDiff(x.convictionDate, x.birthDate),
    ageAtFirstSanctionDate: dateDiff(x.firstSanctionDate, x.birthDate),
    ageAtAssessmentDate: dateDiff(x.assessmentDate, x.birthDate),
  });

// public

module.exports = withInputs(calcOGRS3);
