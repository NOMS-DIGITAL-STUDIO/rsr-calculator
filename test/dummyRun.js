const RSRCalc = require('../lib');
const dummyData = require('./data/query_data.json');

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
let totalWithErrors = 0;
let totalWithDiff = 0;

dummyData.forEach((rawData) => {
  var offenderData = cloneWithDateObjects(rawData);
  var result = RSRCalc.calculateRisk(offenderData);

  var beta18 = result.riskOfSeriousRecidivismBeta18;
  var betaNodeJS = result.riskOfSeriousRecidivismNodeJS;

  total += 1;

  if (result.errors) {
    totalWithErrors += 1;

    console.log(offenderData.testNumber, 'Error', result.errors);
    console.log('==========');
  } else {
    if (betaNodeJS[0] !== beta18[0] || betaNodeJS[1] !== beta18[1]) {
      totalWithDiff += 1;

      console.log(offenderData.testNumber, 'Scores', beta18, betaNodeJS);
      console.log(offenderData.testNumber, 'Percentiles', result.RSRPercentileRiskBeta18, result.RSRPercentileRiskNodeJS);
      console.log(offenderData.testNumber, 'Risk Bands', result.RSRRiskBandBeta18, result.RSRRiskBandNodeJS);
      console.log('==========');
    }
  }

});

console.log(`Total Number of scores ${total}`);
console.log(`- Correct ${total - totalWithDiff - totalWithErrors}`);
console.log(`- Different ${totalWithDiff}`);
console.log(`- Errors ${totalWithErrors}`);
