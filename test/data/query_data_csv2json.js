const util = require('util');
const fs = require('fs');
const csv = require('csvtojson');

const writeFile = util.promisify(fs.writeFile);
const data = [];
let index = 1;

const DATE_TYPE_FIELDS = [
  'birthDate',
  'convictionDate',
  'sentenceDate',
  'firstSanctionDate',
  'assessmentDate',
  'mostRecentSexualOffence'
];

csv()
  .fromFile('./test/data/query_data.csv')
  .on('json', x => {
    let o = JSON.parse(x.response);

    o.output_sv_static = o.riskOfSeriousRecidivism[0];
    o.output_sv_dynamic = o.riskOfSeriousRecidivism[1];

    DATE_TYPE_FIELDS
      .forEach(p => o[p] = o[p].split('T')[0]);

    [
      'coefficients',
      'OGRS3',
      'calculatorVersion',
      'RSRRiskBand',
      'RSRPercentileRisk',
      'RSRRiskBandNodeJS',
      'RSRPercentileRiskNodeJS',
      'RSRRiskBandBeta18',
      'RSRPercentileRiskBeta18',
      'OGRS3PercentileRisk',
      'OGRS4sRiskBand',
      'riskOfSeriousRecidivismNodeJS',
      'riskOfSeriousRecidivismBeta18',
      'contactSexualProbability',
      'indecentImageProbability',
      'probabilityOfNonSexualViolence',
      'OGRS4v',
      'OGRS4s',
      'riskOfSeriousRecidivism',
    ]
    .forEach(p => delete o[p]);

    o.testNumber = 'T' + index;
    o.execution = true;
    index++;

    data.push(o);
  })
  .on('done', error => {
    if (error) {
      console.error(error);
      return;
    }

    writeFile('./test/data/query_data.json', JSON.stringify(data, null, '  '))
      .catch(error => {
        console.error(error);
      });
  });
