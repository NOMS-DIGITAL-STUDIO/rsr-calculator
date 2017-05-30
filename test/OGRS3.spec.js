const fixtureGenerators = require('./helpers/fixtureGenerators');

describe('OGRS3 Calculator', function () {
  var calcOGRS3 = require('../lib/').calculateOGRS3;

  describe('With a known set of coefficients', function() {
    var coefficients = require('./data/coefficients.json');

    it('should calculate the correct result for 1st sanction', function() {
      var result = calcOGRS3({
        coefficients: coefficients,

        sex: 0,                                       // male
        currentOffenceType: 0,                        // violence
        allSanctions: 0,                         // no previous sanctions
        birthDate: (new Date(1997, 01, 01)),
        convictionDate: (new Date(2017, 01, 01)),
        firstSanctionDate: (new Date(2017, 01, 01)),
        assessmentDate: (new Date(2017, 01, 01)),
      });

      result.should.have.property('OGRS3');
      result.OGRS3.should.eql([0.12161553504714574, 0.22130521140511314]);
    });

    it('should calculate the correct result for 2nd sanction', function() {
      var result = calcOGRS3({
        coefficients: coefficients,

        sex: 0,                                       // male
        currentOffenceType: 0,                        // violence
        allSanctions: 1,                         // no previous sanctions
        birthDate: (new Date(1997, 01, 01)),
        convictionDate: (new Date(2017, 01, 01)),
        firstSanctionDate: (new Date(2017, 01, 01)),
        assessmentDate: (new Date(2017, 01, 01)),
      });

      result.should.have.property('OGRS3');
      result.OGRS3.should.eql([0.3158120100020924, 0.48651769565917]);
    });

    it('should calculate the correct result for 3rd sanction', function() {
      var result = calcOGRS3({
        coefficients: coefficients,

        sex: 0,                                       // male
        currentOffenceType: 0,                        // violence
        allSanctions: 2,                         // no previous sanctions
        birthDate: (new Date(1997, 01, 01)),
        convictionDate: (new Date(2017, 01, 01)),
        firstSanctionDate: (new Date(2017, 01, 01)),
        assessmentDate: (new Date(2017, 01, 01)),
      });

      result.should.have.property('OGRS3');
      result.OGRS3.should.eql([0.43393890261473633, 0.6114342480551298]);
    });

    it('should calculate the correct result for 4th sanction', function() {
      var result = calcOGRS3({
        coefficients: coefficients,

        sex: 0,                                       // male
        currentOffenceType: 0,                        // violence
        allSanctions: 3,                         // no previous sanctions
        birthDate: (new Date(1997, 01, 01)),
        convictionDate: (new Date(2017, 01, 01)),
        firstSanctionDate: (new Date(2017, 01, 01)),
        assessmentDate: (new Date(2017, 01, 01)),
      });

      result.should.have.property('OGRS3');
      result.OGRS3.should.eql([0.5235145926731711, 0.6928061177628605]);
    });

    it('should calculate the correct result for 5th sanction', function() {
      var result = calcOGRS3({
        coefficients: coefficients,

        sex: 0,                                       // male
        currentOffenceType: 0,                        // violence
        allSanctions: 4,                         // no previous sanctions
        birthDate: (new Date(1997, 01, 01)),
        convictionDate: (new Date(2017, 01, 01)),
        firstSanctionDate: (new Date(2017, 01, 01)),
        assessmentDate: (new Date(2017, 01, 01)),
      });

      result.should.have.property('OGRS3');
      result.OGRS3.should.eql([0.5922581047904114, 0.7488430658491833]);
    });
  });
});
