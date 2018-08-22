const pkg = require('../package.json');
const should = require('chai').should();

const calcStaticScore = require('../lib/calculateOSPStaticScore');
const calc = require('../lib/calculateOffenderSexualProbability');

describe('Offender Sexual Predictor Score', () => {
  describe('when required data is not present', () => {
    var data = {};

    data.OSPStaticScore = calcStaticScore(data);

    it('should produce two scores of 0', () => {
      calc(data).should.eql([0, 0]);
    });
  });

  describe('when only data is sentenceDate', () => {
    var data = {
      sentenceDate: new Date(2017, 0, 1),
    };

    data.OSPStaticScore = calcStaticScore(data);

    it('should produce two scores of 0', () => {
      calc(data).should.eql([0, 0]);
    });
  });

  describe('when only data is that there is no current or previous sexual element', () => {
    var data = {
      hasSexualElementOrOffence: false,
    };

    data.OSPStaticScore = calcStaticScore(data);

    it('should produce two scores of 0', () => {
      calc(data).should.eql([0, 0]);
    });
  });

  describe('when data describes a woman', () => {
    var data = {
      isFemale: true,
      isMale: false,
    };

    data.OSPStaticScore = calcStaticScore(data);

    it('should produce two scores of 0', () => {
      calc(data).should.eql([0, 0]);
    });
  });

  describe('when data describes a woman with sexual history', () => {
    var data = {
      isFemale: true,
      isMale: false,
      hasSexualElementOrOffence: true,
    };

    data.OSPStaticScore = calcStaticScore(data);

    it('should produce two scores of 0', () => {
      calc(data).should.eql([0.0051813471502590676, 0.0051813471502590676]);
    });
  });

  describe('when data describes a male with one previous sexual offence', () => {
    var data = {
      isFemale: false,
      isMale: true,
      hasSexualElementOrOffence: true,

      ageAtSentenceDate: 44,
      ageAtMostRecentSexualOffence: 24,
    };

    data.OSPStaticScore = calcStaticScore(data);

    it('should produce the correct two scores', () => {
      calc(data).should.eql([0.0011337498545397012, 0.0020657476931578104]);
    });
  });

  describe('when data describes a 20yr old male sex offender', () => {
    var data = {
      isFemale: false,
      isMale: true,
      hasSexualElementOrOffence: true,

      ageAtSentenceDate: 20,
      ageAtMostRecentSexualOffence: 20,
    };

    data.OSPStaticScore = calcStaticScore(data);

    it('should produce the correct two scores', () => {
      calc(data).should.eql([0.003132032644783993, 0.005697347108184677]);
    });
  });

  describe('when data describes a 30yr old male sex offender', () => {
    var data = {
      isFemale: false,
      isMale: true,
      hasSexualElementOrOffence: true,

      ageAtSentenceDate: 30,
      ageAtMostRecentSexualOffence: 30,
    };

    data.OSPStaticScore = calcStaticScore(data);

    it('should produce the correct two scores', () => {
      calc(data).should.eql([0.0018848635402728066, 0.003432191950002231]);
    });
  });

  describe('when data describes a 60yr old male sex offender', () => {
    var data = {
      isFemale: false,
      isMale: true,
      hasSexualElementOrOffence: true,

      ageAtSentenceDate: 60,
      ageAtMostRecentSexualOffence: 60,
    };

    data.OSPStaticScore = calcStaticScore(data);

    it('should produce the correct two scores', () => {
      calc(data).should.eql([0.0005286231953860869, 0.0009636572293041416]);
    });
  });
});
