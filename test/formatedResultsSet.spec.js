const pkg = require('../package.json');
const should = require('chai').should();
const fixtureGenerators = require('./helpers/fixtureGenerators');

const RSRCalc = require('../lib').calculateRisk;

describe("Risk Of Serious Recidivism Calculator", () => {
  describe("Formatted results set", () => {
    var data = {
      birthDate:(new Date(1997, 01, 01)),
      sex:1,
      pncId:'X558007 62',
      currentOffenceType:13,
      convictionDate:(new Date(2017, 01, 01)),
      sentenceDate:(new Date(2017, 01, 01)),
      sexualElement:1,
      strangerVictim:null,
      violentOffenceCategory:'',
      firstSanctionDate:(new Date(2017, 01, 01)),
      allSanctions:4,
      violentSanctions:2,
      sexualOffenceHistory:1,
      mostRecentSexualOffence:'',
      contactAdult:0,
      contactChild:0,
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
      anyOtherOffence:1,
      oasysInterview:0,
      useWeapon:1,
      partner:1,
      accommodation:0,
      employment:1,
      relationship:1,
      domesticViolence:1,
      currentUseOfAlcohol:0,
      bingeDrinking:0,
      impulsivity:1,
      temper:1,
      proCriminal:0,
      assessmentDate:(new Date(2017, 01, 01))
    };

    var result = RSRCalc(data);

    it('should include package version number in results', () => {
      result.should.have.property('calculatorVersion');
      result.calculatorVersion.should.equal(pkg.version);
    });

    it('should include OASys Score in results', () => {
      result.should.have.property('oasysScore');
      result.oasysScore.should.be.greaterThan(0);
    });

    it('should include RSR Score in results', () => {
      result.should.have.property('riskOfSeriousRecidivismScore');
      result.riskOfSeriousRecidivismScore.should.be.lessThan(0);
    });

    it('should include a probability of Non Sexual Violence in results', () => {
      result.should.have.property('probabilityOfNonSexualViolence');
      result.probabilityOfNonSexualViolence.length.should.equal(2);
    });

    it('should include an Indecent Image Probability in results', () => {
      result.should.have.property('indecentImageProbability');
      result.indecentImageProbability.length.should.equal(2);
    });

    it('should include an Contact Sexual Probability in results', () => {
      result.should.have.property('contactSexualProbability');
      result.contactSexualProbability.length.should.equal(2);
    });

    it('should include an Risk of Serious Recidivism in results', () => {
      result.should.have.property('riskOfSeriousRecidivism');
      result.riskOfSeriousRecidivism.length.should.equal(2);
    });
  });
});
