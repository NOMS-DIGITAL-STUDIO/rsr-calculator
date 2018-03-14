const RSRCalc = require('../lib');
const dummyData = require('./data/data.json');

const DATE_TYPE_FIELDS = [
  'birthDate',
  'convictionDate',
  'sentenceDate',
  'firstSanctionDate',
  'assessmentDate',
  'mostRecentSexualOffence'
];

const parseDate = (input) => {
  var parts = String.prototype.split.call(input || 'sample data', '-');
  return parts.length === 3 ? new Date(parts[0], parts[1]-1, parts[2]) : parts[0];
};

const cloneWithDateObjects = (x) => {
  var out = {};
  for (var key in x) {
    out[key] = ~DATE_TYPE_FIELDS.indexOf(key) ? parseDate(x[key]) : x[key];
  }
  return out;
};

dummyData.forEach((rawData) => {
  var offenderData = cloneWithDateObjects(rawData);
  var result = RSRCalc.calculateRisk(offenderData);

  var beta14 = result.riskOfSeriousRecidivismBeta14;
  var beta18 = result.riskOfSeriousRecidivism;

  if (beta14[0] !== beta18[0] || beta14[1] !== beta18[1]) {
    console.log('==========');
    //console.log('OFFENDER DATA');
    //console.log(RSRCalc.printOffenderData(offenderData));

    console.log('**********');
    console.log('RESULT');
    console.log(beta14, beta18);
    console.log(result.RSRPercentileRiskBeta14, result.RSRPercentileRisk);
    console.log(result.RSRRiskBandBeta14, result.RSRRiskBand);
    console.log('==========');
  }
});
