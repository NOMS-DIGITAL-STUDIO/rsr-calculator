const pkg = require('../package.json');
const should = require('chai').should();

const calculateRisk = require('../lib').calculateRisk;

describe('Risk Of Serious Recidivism Calculator', () => {

  describe('with all the required dates', () => {
    var data = {
      birthDate: new Date('1961-03-01T00:00:00.000Z'),
      firstSanctionDate: new Date('1982-03-01T00:00:00.000Z'),
      convictionDate: new Date('2018-03-01T00:00:00.000Z'),
      sentenceDate: new Date('2018-03-01T00:00:00.000Z'),
      assessmentDate: new Date('2018-03-01T00:00:00.000Z'),
      currentOffenceType: 13,
    };

    var result = calculateRisk(data);

    it('should not include any validation errors', () => {
      should.not.exist(result.errors);
    });
  });

  describe('with dates for a youth conviction', () => {
    var data = {
      birthDate: new Date('2010-03-01T00:00:00.000Z'),
      firstSanctionDate: new Date('2012-03-01T00:00:00.000Z'),
      convictionDate: new Date('2018-03-01T00:00:00.000Z'),
      sentenceDate: new Date('2018-03-01T00:00:00.000Z'),
      assessmentDate: new Date('2018-03-01T00:00:00.000Z'),
      currentOffenceType: 13,
    };

    var result = calculateRisk(data);

    it('Should validate that the offender is not an adult', () => {
      should.exist(result.errors);
      should.exist(result.errors.birthDate);
      result.errors.birthDate.should.be.a('string');
    });
  });

  describe('with dates for an adult conviction', () => {
    var data = {
      birthDate: new Date('2000-03-01T00:00:00.000Z'),
      firstSanctionDate: new Date('2012-03-01T00:00:00.000Z'),
      convictionDate: new Date('2018-03-01T00:00:00.000Z'),
      sentenceDate: new Date('2018-03-01T00:00:00.000Z'),
      assessmentDate: new Date('2018-03-01T00:00:00.000Z'),
      currentOffenceType: 13,
    };

    var result = calculateRisk(data);

    it('Should validate that the offender is an adult', () => {
      should.not.exist(result.errors);
    });
  });

  describe('with dates for "sentenceDate" before "convictionDate"', () => {
    var data = {
      birthDate: new Date('1990-03-01T00:00:00.000Z'),
      firstSanctionDate: new Date('2012-03-01T00:00:00.000Z'),
      convictionDate: new Date('2018-03-01T00:00:00.000Z'),
      sentenceDate: new Date('2010-03-01T00:00:00.000Z'),
      assessmentDate: new Date('2018-03-01T00:00:00.000Z'),
      currentOffenceType: 13,
    };

    var result = calculateRisk(data);

    it('Should validate that the "convictionDate" did not happen before the "sentenceDate"', () => {
      should.exist(result.errors);
      should.exist(result.errors.convictionDate);
      result.errors.convictionDate.should.be.a('string');
    });
  });

  describe('with dates for "sentenceDate" after "convictionDate"', () => {
    var data = {
      birthDate: new Date('1990-03-01T00:00:00.000Z'),
      firstSanctionDate: new Date('2012-03-01T00:00:00.000Z'),
      convictionDate: new Date('2010-03-01T00:00:00.000Z'),
      sentenceDate: new Date('2018-03-01T00:00:00.000Z'),
      assessmentDate: new Date('2018-03-01T00:00:00.000Z'),
      currentOffenceType: 13,
    };

    var result = calculateRisk(data);

    it('Should validate that the "convictionDate" did happen before the "sentenceDate"', () => {
      should.not.exist(result.errors);
    });
  });

  describe('with dates for "firstSanctionDate" after "mostRecentSexualOffence"', () => {
    var data = {
      birthDate: new Date('1990-03-01T00:00:00.000Z'),
      firstSanctionDate: new Date('2018-03-01T00:00:00.000Z'),
      convictionDate: new Date('2018-03-01T00:00:00.000Z'),
      sentenceDate: new Date('2018-03-01T00:00:00.000Z'),
      assessmentDate: new Date('2018-03-01T00:00:00.000Z'),
      mostRecentSexualOffence: new Date('2012-03-01T00:00:00.000Z'),
      currentOffenceType: 13,
    };

    var result = calculateRisk(data);

    it('Should validate that the "firstSanctionDate" did not happen before the "mostRecentSexualOffence"', () => {
      should.exist(result.errors);
      should.exist(result.errors.mostRecentSexualOffence);
      result.errors.mostRecentSexualOffence.should.be.a('string');
    });
  });

  describe('with dates for "firstSanctionDate" before "mostRecentSexualOffence"', () => {
    var data = {
      birthDate: new Date('1990-03-01T00:00:00.000Z'),
      firstSanctionDate: new Date('2012-03-01T00:00:00.000Z'),
      convictionDate: new Date('2018-03-01T00:00:00.000Z'),
      sentenceDate: new Date('2018-03-01T00:00:00.000Z'),
      assessmentDate: new Date('2018-03-01T00:00:00.000Z'),
      mostRecentSexualOffence: new Date('2018-03-01T00:00:00.000Z'),
      currentOffenceType: 13,
    };

    var result = calculateRisk(data);

    it('Should validate that the "firstSanctionDate" did happen before the "mostRecentSexualOffence"', () => {
      should.not.exist(result.errors);
    });
  });

  [
    'birthDate',
    'convictionDate',
    'sentenceDate',
    'firstSanctionDate',
    'assessmentDate',
  ].forEach(p => {
    describe(`with "${p}"`, () => {

      describe('as a valid date value', () => {
        var data = {
          birthDate: new Date('1990-03-01T00:00:00.000Z'),
          firstSanctionDate: new Date('2012-03-01T00:00:00.000Z'),
          convictionDate: new Date('2018-03-01T00:00:00.000Z'),
          sentenceDate: new Date('2018-03-01T00:00:00.000Z'),
          assessmentDate: new Date('2018-03-01T00:00:00.000Z'),
          currentOffenceType: 13,
        };

        data[p] = data[p] || new Date('2018-03-01T00:00:00.000Z');

        var result = calculateRisk(data);

        it(`Should validate that "${p}" is a "valid date"`, () => {
          should.not.exist(result.errors);
        });
      });

      describe('as an invalid date value', () => {
        var data = {
          birthDate: new Date('1990-03-01T00:00:00.000Z'),
          firstSanctionDate: new Date('2012-03-01T00:00:00.000Z'),
          convictionDate: new Date('2018-03-01T00:00:00.000Z'),
          sentenceDate: new Date('2018-03-01T00:00:00.000Z'),
          assessmentDate: new Date('2018-03-01T00:00:00.000Z'),
          currentOffenceType: 13,
        };

        data[p] = new Date('FOO');

        var result = calculateRisk(data);

        it(`Should validate that "${p}" is not a "valid date"`, () => {
          should.exist(result.errors);
          should.exist(result.errors[p]);
          result.errors[p].should.be.a('string');
          result.errors[p].should.have.string(`"${p}"`);
          result.errors[p].should.have.string('valid date');
        });
      });

      describe('as a string value', () => {
        var data = {
          birthDate: new Date('1990-03-01T00:00:00.000Z'),
          firstSanctionDate: new Date('2012-03-01T00:00:00.000Z'),
          convictionDate: new Date('2018-03-01T00:00:00.000Z'),
          sentenceDate: new Date('2018-03-01T00:00:00.000Z'),
          assessmentDate: new Date('2018-03-01T00:00:00.000Z'),
          currentOffenceType: 13,
        };

        data[p] = 'FOO';

        var result = calculateRisk(data);

        it(`Should validate that "${p}" is not a "valid date"`, () => {
          should.exist(result.errors);
          should.exist(result.errors[p]);
          result.errors[p].should.be.a('string');
          result.errors[p].should.have.string(`"${p}"`);
          result.errors[p].should.have.string('valid date');
        });
      });
    });
  });
});
