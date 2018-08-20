const pkg = require('../package.json');
const should = require('chai').should();

const calc = require('../lib/calculateOffenderSexualProbability');

describe('Offender Sexual Predictor Score', () => {
  describe('when required data is not present', () => {
    var data = {};

    it('should produce two scores of 0', () => {
      calc(data).should.eql([0, 0]);
    });
  });

  describe('when only data is sentenceDate', () => {
    var data = {
      sentenceDate: new Date(2017, 0, 1),
    };

    it('should produce two scores of 0', () => {
      calc(data).should.eql([0, 0]);
    });
  });

  describe('when only data is that there is no current or previous sexual element', () => {
    var data = {
      sexualOffenceHistory: 1,
      sexualElement: 1,
    };

    it('should produce two scores of 0', () => {
      calc(data).should.eql([0, 0]);
    });
  });

  describe('when data describes a woman', () => {
    var data = {
      sex: 1,
    };

    it('should produce two scores of 0', () => {
      calc(data).should.eql([0, 0]);
    });
  });

  describe('when data describes a woman with sexual history', () => {
    var data = {
      sex: 1,
      sexualOffenceHistory: 0,
    };

    it('should produce two scores of 0', () => {
      calc(data).should.eql([0.0051813471502590676, 0.0051813471502590676]);
    });
  });

  describe('when data describes a woman with a sexual element', () => {
    var data = {
      sex: 1,
      sexualElement: 0,
    };

    it('should produce two scores of 0', () => {
      calc(data).should.eql([0.0051813471502590676, 0.0051813471502590676]);
    });
  });

  describe('when data describes a male with one previous sexual offence', () => {
    var data = {
      sex: 0,                             // 0 = Male, 1 = Female
      sexualOffenceHistory: 1,            // 0 = yes, 1 = no
      sexualElement: 0,                   // 0 = yes, 1 = no
      birthDate: new Date(1974, 0, 1),
      mostRecentSexualOffence: new Date(1998, 0, 1),
      sentenceDate: new Date(2017, 0, 1),
    };

    it('should produce the correct two scores', () => {
      calc(data).should.eql([0.0011337498545397012, 0.0020657476931578104]);
    });
  });

  describe('when data describes a 20yr old male sex offender', () => {
    var data = {
      sex: 0,                             // 0 = Male, 1 = Female
      sexualOffenceHistory: 1,            // 0 = yes, 1 = no
      sexualElement: 0,                   // 0 = yes, 1 = no
      birthDate: new Date(1997, 0, 1),
      convictionDate: new Date(2017, 0, 1),
      mostRecentSexualOffence: new Date(2017, 0, 1),
      assessmentDate: new Date(2017, 0, 1),
      sentenceDate: new Date(2017, 0, 1),
    };

    it('should produce the correct two scores', () => {
      calc(data).should.eql([0.003132032644783993, 0.005697347108184677]);
    });
  });

  describe('when data describes a 30yr old male sex offender', () => {
    var data = {
      sex: 0,                             // 0 = Male, 1 = Female
      sexualOffenceHistory: 0,            // 0 = yes, 1 = no
      sexualElement: 0,                   // 0 = yes, 1 = no
      birthDate: new Date(1987, 0, 1),
      convictionDate: new Date(2017, 0, 1),
      mostRecentSexualOffence: new Date(2017, 0, 1),
      assessmentDate: new Date(2017, 0, 1),
      sentenceDate: new Date(2017, 0, 1),
    };

    it('should produce the correct two scores', () => {
      calc(data).should.eql([0.0018848635402728066, 0.003432191950002231]);
    });
  });

  describe('when data describes a 60yr old male sex offender', () => {
    var data = {
      sex: 0,                             // 0 = Male, 1 = Female
      sexualOffenceHistory: 0,            // 0 = yes, 1 = no
      sexualElement: 1,                   // 0 = yes, 1 = no
      birthDate: new Date(1957, 0, 1),
      convictionDate: new Date(2017, 0, 1),
      mostRecentSexualOffence: new Date(2017, 0, 1),
      assessmentDate: new Date(2017, 0, 1),
      sentenceDate: new Date(2017, 0, 1),
    };

    it('should produce the correct two scores', () => {
      calc(data).should.eql([0.0005286231953860869, 0.0009636572293041416]);
    });
  });
});
