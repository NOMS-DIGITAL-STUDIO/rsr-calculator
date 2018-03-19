const pkg = require('../package.json');
require('chai').should();

const calculateRisk = require('../lib').calculateRisk;



describe('Risk Of Serious Recidivism Calculator', () => {
  describe('Contractual results set', () => {
    let data = {
      sex: 0,   // male
      birthDate: new Date('1970-01-01T00:00:00.000Z'),
      assessmentDate: new Date('2018-03-07T00:00:00.000Z'),
      currentOffenceType: 0,
      convictionDate: new Date('2018-03-07T00:00:00.000Z'),
      sentenceDate: new Date('2018-03-07T00:00:00.000Z'),
      sexualElement: 1, // no
      violentOffenceCategory: '',
      strangerVictim: '',
      firstSanctionDate: new Date('2018-03-07T00:00:00.000Z'),
      previousSanctions: 0,
      violentSanctions: 0,
      sexualOffenceHistory: 1, // no
      oasysInterview: 1, // no
    };

  data = {
    sex: '0',
    birthDate: new Date('1970-01-01T00:00:00.000Z'),
    assessmentDate: new Date('2018-03-07T00:00:00.000Z'),
    currentOffenceType: '0',
    convictionDate: new Date('2018-03-07T00:00:00.000Z'),
    sentenceDate: new Date('2018-03-07T00:00:00.000Z'),
    sexualElement: '1', //no
    violentOffenceCategory: '',
    strangerVictim: '',
    firstSanctionDate: new Date('2018-03-07T00:00:00.000Z'),
    previousSanctions: 0,
    violentSanctions: 0,
    sexualOffenceHistory: '1',
    oasysInterview:1,
  };

    var result = calculateRisk(data);

    it('should include a RSR Percentile Risk', () => {
      result.RSRPercentileRisk.should.eql([ 0.12, 0.22 ]);
    });
  });
});
