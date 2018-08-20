const pkg = require('../package.json');
const should = require('chai').should();

const calculateRisk = require('../lib').calculateRisk;

describe('Risk Of Serious Recidivism Calculator', () => {

  describe('Historic Case 001', () => {
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

    var result = calculateRisk(data);

    it('should include a correct RSR Percentile Risk', () => {
      result.RSRPercentileRisk.should.eql([ 0.12, 0.22 ]);
    });
  });

  describe('Historic Case 002', () => {
    let data = {
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

    it('should include a correct RSR Percentile Risk', () => {
      result.RSRPercentileRisk.should.eql([ 0.12, 0.22 ]);
    });
  });

  describe('Historic Case 003', () => {
    let data = {
      sex: 0,
      gender: 'M',
      previousSanctions: 21,
      currentOffenceType: 16,
      birthDate: new Date('1993-04-21T23:00:00.0000000Z'),
      assessmentDate: new Date('2018-04-10T23:00:00.0000000Z'),
      convictionDate: new Date('2007-10-02T23:00:00.0000000Z'),
      sentenceDate: new Date('2018-03-28T23:00:00.0000000Z'),
      firstSanctionDate: new Date('2007-10-02T23:00:00.0000000Z'),
      mostRecentSexualOffence: new Date('1899-11-30T00:00:00.0000000Z'),
      sexualElement: 1,
      strangerVictim: 0,
      violentSanctions: 6,
      sexualOffenceHistory: 1,
      oasysInterview: 1, // no
    };

    var result = calculateRisk(data);

    it('should include correct RSR Percentile Risk', () => {
      result.RSRPercentileRisk.should.eql([ 3.69, 6.56 ]);
    });
  });
});
