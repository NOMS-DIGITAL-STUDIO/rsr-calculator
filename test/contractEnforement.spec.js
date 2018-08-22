const pkg = require('../package.json');
const should = require('chai').should();

const calculateRisk = require('../lib').calculateRisk;

describe('Risk Of Serious Recidivism Calculator', () => {
  describe('Contractual results set', () => {
    var data = {
      sex: 0,
      birthDate: new Date('1961-03-01T00:00:00.000Z'),
      assessmentDate: new Date('2018-03-07T00:00:00.000Z'),
      currentOffenceType: 14,
      convictionDate: new Date('2018-02-23T00:00:00.000Z'),
      sentenceDate: new Date('2018-03-16T00:00:00.000Z'),
      sexualElement: 0, // yes
      violentOffenceCategory: undefined,
      strangerVictim: 1, // no
      firstSanctionDate: new Date('1982-10-18T00:00:00.000Z'),
      previousSanctions: 4,
      violentSanctions: 2,
      sexualOffenceHistory: 1, // no
      mostRecentSexualOffence: new Date('2018-02-23T00:00:00.000Z'),
      contactAdult: 0,
      contactChild: 1,
      indecentImage: 1,
      paraphilia: 0,
      oasysInterview: 0, // yes
      useWeapon: 1, // no
      partner: undefined,
      accommodation: 2,
      employment: 0, // yes
      relationship: 1,
      currentUseOfAlcohol: 0,
      bingeDrinking: 0,
      impulsivity: 1,
      temper: 1,
      proCriminal: 1,
      domesticViolence: 0, // yes
      murder: 1, // no
      wounding: 1, // no
      kidnapping: 1, // no
      firearmPossession: 1, // no
      robbery: 1, // no
      burglary: 1, // no
      anyOtherOffence: 1, // no
      endangerLife: 1, // no
      arson: 1, // no
    };

    var result = calculateRisk(data);

    it('should include a RSR Percentile Risk', () => {
      result.RSRPercentileRisk.should.eql([ 2.15, 3.39 ]);
    });
  });

  describe('Contractual results set', () => {
    var data = {
      birthDate:(new Date(1997, 01, 01)),
      sex:0,
      pncId:'X558007 62',
      currentOffenceType:13,
      convictionDate:(new Date(2017, 01, 01)),
      sentenceDate:(new Date(2017, 01, 01)),
      sexualElement:1,
      strangerVictim:1,
      violentOffenceCategory:'',
      firstSanctionDate:(new Date(2017, 01, 01)),
      previousSanctions:4,
      violentSanctions:2,
      sexualOffenceHistory:0,
      mostRecentSexualOffence:(new Date(2017, 01, 01)),
      contactAdult:0,
      contactChild:1,
      indecentImage:0,
      paraphilia:0,
      murder:1,
      wounding:1,
      burglary:1,
      arson:1,
      endagerLife:1,
      kidnapping:1,
      firearmPossession:1,
      robbery:1,
      anyOtherOffence:0,
      oasysInterview:0,
      useWeapon:1,
      partner:1,
      accommodation:2,
      employment:0,
      relationship:1,
      domesticViolence:1,
      currentUseOfAlcohol:0,
      bingeDrinking:0,
      impulsivity:0,
      temper:0,
      proCriminal:0,
      assessmentDate:(new Date(2017, 01, 01))
    };

    var result = calculateRisk(data);

    it('should include package version number in results', () => {
      result.should.have.property('calculatorVersion');
      result.calculatorVersion.should.equal(pkg.version);
    });

    it('should include a probability of Non Sexual Violence in results', () => {
      result.should.have.property('probabilityOfNonSexualViolence');
      result.probabilityOfNonSexualViolence.length.should.equal(2);
    });

    it('should include an Indecent Image Probability in results', () => {
      result.should.have.property('indecentImageProbability');
      result.indecentImageProbability.length.should.equal(2);
    });

    it('should include an Offender Sexual Probability (OSP) in results', () => {
      result.should.have.property('OSPScore');
      result.OSPScore.length.should.equal(2);
    });

    it('should include a OSP Risk Band', () => {
      result.should.have.property('OSPRiskBand');
    });

    it('should include an Risk of Serious Recidivism in results', () => {
      result.should.have.property('riskOfSeriousRecidivism');
      result.riskOfSeriousRecidivism.length.should.equal(2);
    });

    it('should include a RSR Percentile Risk', () => {
      result.should.have.property('RSRPercentileRisk');
      result.RSRPercentileRisk.length.should.equal(2);
    });

    it('should include a RSR Risk Band', () => {
      result.should.have.property('RSRRiskBand');
      result.RSRRiskBand.length.should.equal(2);
    });
  });

});
