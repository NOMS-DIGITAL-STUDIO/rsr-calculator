const fixtureGenerators = require('./helpers/fixtureGenerators');

describe('OGRS3 Calculator', function () {
  var calcOGRS3 = require('../lib/').calculateOGRS3;

  describe('With a known set of coefficients', function() {
    var coefficients = require('./data/coefficients.json');

    it('should calculate the correct result for 1st sanction', function() {
      var result = calcOGRS3({
        coefficients: coefficients,

        gender: 0,                                       // male
        currentOffenceType: 0,                        // violence
        previousSanctions: 0,                         // no previous sanctions
        birthDate: (new Date(1997, 01, 01)),
        convictionDate: (new Date(2017, 01, 01)),
        firstSanctionDate: (new Date(2017, 01, 01)),
        assessmentDate: (new Date(2017, 01, 01)),
      });

      result.should.have.property('OGRS3');
      result.OGRS3.should.have.property('result');
      result.OGRS3.result.should.eql([0.12161553504714574, 0.22130521140511314]);
    });

    it('should calculate the correct result for 2nd sanction', function() {
      var result = calcOGRS3({
        coefficients: coefficients,

        gender: 0,                                       // male
        currentOffenceType: 0,                        // violence
        previousSanctions: 1,                         // no previous sanctions
        birthDate: (new Date(1997, 01, 01)),
        convictionDate: (new Date(2017, 01, 01)),
        firstSanctionDate: (new Date(2017, 01, 01)),
        assessmentDate: (new Date(2017, 01, 01)),
      });

      result.should.have.property('OGRS3');
      result.OGRS3.should.have.property('result');
      result.OGRS3.result.should.eql([0.3158120100020924, 0.48651769565917]);
    });

    it('should calculate the correct result for 3rd sanction', function() {
      var result = calcOGRS3({
        coefficients: coefficients,

        gender: 0,                                       // male
        currentOffenceType: 0,                        // violence
        previousSanctions: 2,                         // no previous sanctions
        birthDate: (new Date(1997, 01, 01)),
        convictionDate: (new Date(2017, 01, 01)),
        firstSanctionDate: (new Date(2017, 01, 01)),
        assessmentDate: (new Date(2017, 01, 01)),
      });

      result.should.have.property('OGRS3');
      result.OGRS3.should.have.property('result');
      result.OGRS3.result.should.eql([0.43393890261473633, 0.6114342480551298]);
    });

    it('should calculate the correct result for 4th sanction', function() {
      var result = calcOGRS3({
        coefficients: coefficients,

        gender: 0,                                       // male
        currentOffenceType: 0,                        // violence
        previousSanctions: 3,                         // no previous sanctions
        birthDate: (new Date(1997, 01, 01)),
        convictionDate: (new Date(2017, 01, 01)),
        firstSanctionDate: (new Date(2017, 01, 01)),
        assessmentDate: (new Date(2017, 01, 01)),
      });

      result.should.have.property('OGRS3');
      result.OGRS3.should.have.property('result');
      result.OGRS3.result.should.eql([0.5235145926731711, 0.6928061177628605]);
    });

    it('should calculate the correct result for 5th sanction', function() {
      var result = calcOGRS3({
        coefficients: coefficients,

        gender: 0,                                       // male
        currentOffenceType: 0,                        // violence
        previousSanctions: 4,                         // no previous sanctions
        birthDate: (new Date(1997, 01, 01)),
        convictionDate: (new Date(2017, 01, 01)),
        firstSanctionDate: (new Date(2017, 01, 01)),
        assessmentDate: (new Date(2017, 01, 01)),
      });

      result.should.have.property('OGRS3');
      result.OGRS3.should.have.property('result');
      result.OGRS3.result.should.eql([0.5922581047904114, 0.7488430658491833]);
    });

    it('should caclulate the same result as the existing tool', function() {
      var result = calcOGRS3({
        coefficients: coefficients,

        gender: 1,                                       // female
        currentOffenceType: 16,                          // Criminal Damage
        previousSanctions: 3,
        birthDate: (new Date(1972, 8, 9)),
        convictionDate: (new Date(2009, 8, 9)),
        firstSanctionDate: (new Date(1986, 8, 9)),
        assessmentDate: (new Date(2015, 8, 15)),
      });

      const ln = (x) =>
        Math.log(x);
      const probabilityOfProvenReoffending = (z) =>
        ((ex) => ex / (1 + ex))(Math.exp(z));

      let b1 = 1.251124464 * ln((3 + 1) / (10 + 37 - 14));
      let b2 = 0.463062792;
      let b3 = -1.524652221;
      let b4 = 0.204960477;

      var expected1yr = probabilityOfProvenReoffending(b3 + b2 + b1 + b4 + 1.402562384);
      var expected2yr = probabilityOfProvenReoffending(b3 + b2 + b1 + b4 + 2.121705678);


      result.should.have.property('OGRS3');
      result.OGRS3.should.have.property('result');
      result.OGRS3.should.have.property('explain');
      console.log(result.OGRS3.explain);

      result.OGRS3.explain.currentOffenceFactor.should.equal(b4);
      result.OGRS3.explain.agePolynominalFactor.should.equal(b3);
      result.OGRS3.explain.numberOfSanctionsFactor.should.equal(b2);
      result.OGRS3.explain.copasRate.should.equal(b1);

      result.OGRS3.result.should.eql([expected1yr, expected2yr]);
    });

    it('should caclulate the same result as the existing tool even for a custom factor', function() {
      var result = calcOGRS3({
        coefficients: coefficients,

        gender: 1,                                       // female
        currentOffenceFactor: 0.204960477,               // Criminal Damage
        previousSanctions: 3,
        birthDate: (new Date(1972, 8, 9)),
        convictionDate: (new Date(2009, 8, 9)),
        firstSanctionDate: (new Date(1986, 8, 9)),
        assessmentDate: (new Date(2015, 8, 15)),
      });

      const ln = (x) =>
        Math.log(x);
      const probabilityOfProvenReoffending = (z) =>
        ((ex) => ex / (1 + ex))(Math.exp(z));

      let b1 = 1.251124464 * ln((3 + 1) / (10 + 37 - 14));
      let b2 = 0.463062792;
      let b3 = -1.524652221;
      let b4 = 0.204960477;

      var expected1yr = probabilityOfProvenReoffending(b3 + b2 + b1 + b4 + 1.402562384);
      var expected2yr = probabilityOfProvenReoffending(b3 + b2 + b1 + b4 + 2.121705678);


      result.should.have.property('OGRS3');
      result.OGRS3.should.have.property('result');
      result.OGRS3.should.have.property('explain');
      console.log(result.OGRS3.explain);

      result.OGRS3.explain.currentOffenceFactor.should.equal(b4);
      result.OGRS3.explain.agePolynominalFactor.should.equal(b3);
      result.OGRS3.explain.numberOfSanctionsFactor.should.equal(b2);
      result.OGRS3.explain.copasRate.should.equal(b1);

      result.OGRS3.result.should.eql([expected1yr, expected2yr]);
    });
  });
});
