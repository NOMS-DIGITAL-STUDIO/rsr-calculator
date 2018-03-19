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

let total = 0;

dummyData.forEach((rawData) => {
  var offenderData = cloneWithDateObjects(rawData);
  var result = RSRCalc.calculateRisk(offenderData);

  var beta18 = result.riskOfSeriousRecidivismBeta18;
  var betaNodeJS = result.riskOfSeriousRecidivismNodeJS;

  if (betaNodeJS[0] !== beta18[0] || betaNodeJS[1] !== beta18[1]) {
    console.log('Scores');
    console.log(beta18)
    console.log(betaNodeJS);
    console.log('Percentiles');
    console.log(result.RSRPercentileRiskBeta18)
    console.log(result.RSRPercentileRiskNodeJS);
    console.log('Risk Bands');
    console.log(result.RSRRiskBandBeta18)
    console.log(result.RSRRiskBandNodeJS);
    console.log('==========');
  } else {
    total += 1;
  }
});

console.log(`Number of scores that are equal ${total}`);
