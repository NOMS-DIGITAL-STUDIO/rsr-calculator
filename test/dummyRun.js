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
}

const cloneWithDateObjects = (x) => {
  var out = {};
  for (var key in x) out[key] = ~DATE_TYPE_FIELDS.indexOf(key) ? parseDate(x[key]) : x[key];
  return out;
};

dummyData.forEach((raw_data) => {
  var offender_data = cloneWithDateObjects(raw_data);

  console.log('**********');
  console.log(RSRCalc.printOffenderData(offender_data).join('\n'));

  var result = RSRCalc.calculateRisk(offender_data);

  console.log('**********');
  console.log(result);
  console.log('');
});
