const fixtureGenerators = require('./helpers/fixtureGenerators');

const ln = (x) =>
  Math.log(x);
const probabilityOfProvenReoffending = (z) =>
  ((ex) => ex / (1 + ex))(Math.exp(z));

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
      result.OGRS3.result.should.eql([0.5922581047904115, 0.7488430658491833]);
    });

    it('should calculate the same result as the existing tool', function() {
      var result = calcOGRS3({
        coefficients: coefficients,

        gender: 1,                                       // female
        currentOffenceType: 16,                          // Criminal Damage
        previousSanctions: 5,
        birthDate: (new Date(1972, 8, 9)),
        convictionDate: (new Date(2009, 8, 9)),          // 37
        firstSanctionDate: (new Date(1986, 8, 9)),       // 14
        assessmentDate: (new Date(2015, 8, 15)),         // 43
      });

      let b1 = 1.251124464 * ln((5 + 1) / (10 + 37 - 14));
      let b2 = 0.463062792;
      let b3 = -1.524652221;
      let b4 = 0.204960477;

      const expected = (i) => {
        var e1 = probabilityOfProvenReoffending(b3 + b2 + b1 + b4 + 1.402562384);
        var e2 = probabilityOfProvenReoffending(b3 + b2 + b1 + b4 + 2.121705678);

        return [e1, e2][i-1];
      };


      result.should.have.property('OGRS3');
      result.OGRS3.should.have.property('result');
      result.OGRS3.should.have.property('explain');

      result.OGRS3.explain.currentOffenceFactor.should.equal(b4);
      result.OGRS3.explain.agePolynominalFactor.should.equal(b3);
      result.OGRS3.explain.numberOfSanctionsFactor.should.equal(b2);
      result.OGRS3.explain.copasRate.should.equal(b1);

      result.OGRS3.result.should.eql([expected(1), expected(2)]);
    });

    it('should calculate the same result as the existing tool even for a custom factor', function() {
      var result = calcOGRS3({
        coefficients: coefficients,

        gender: 1,                                       // female
        currentOffenceFactor: 0.204960477,               // Criminal Damage
        previousSanctions: 5,
        birthDate: (new Date(1972, 8, 9)),
        convictionDate: (new Date(2009, 8, 9)),
        firstSanctionDate: (new Date(1986, 8, 9)),
        assessmentDate: (new Date(2015, 8, 15)),
      });

      let b1 = 1.251124464 * ln((5 + 1) / (10 + 37 - 14));
      let b2 = 0.463062792;
      let b3 = -1.524652221;
      let b4 = 0.204960477;

      const expected = (i) => {
        var e1 = probabilityOfProvenReoffending(b3 + b2 + b1 + b4 + 1.402562384);
        var e2 = probabilityOfProvenReoffending(b3 + b2 + b1 + b4 + 2.121705678);

        return [e1, e2][i-1];
      };

      result.should.have.property('OGRS3');
      result.OGRS3.should.have.property('result');
      result.OGRS3.should.have.property('explain');

      result.OGRS3.explain.currentOffenceFactor.should.equal(b4);
      result.OGRS3.explain.agePolynominalFactor.should.equal(b3);
      result.OGRS3.explain.numberOfSanctionsFactor.should.equal(b2);
      result.OGRS3.explain.copasRate.should.equal(b1);

      result.OGRS3.result.should.eql([expected(1), expected(2)]);
    });

    it('should calculate the same result as the whitepaper equation with 4 decimal precision', function() {
      var result = calcOGRS3({
        coefficients: coefficients,

        gender: 1,                                       // female
        currentOffenceFactor: 0.205,                     // Criminal Damage
        previousSanctions: 5,
        birthDate: (new Date(1972, 8, 9)),
        convictionDate: (new Date(2009, 8, 9)),
        firstSanctionDate: (new Date(1986, 8, 9)),
        assessmentDate: (new Date(2015, 8, 15)),
      });

      let b1 = 1.25112 * ln((5 + 1) / (10 + 37 - 14));
      let b2 = 0.46306;
      let b3 = -1.5247;
      let b4 = 0.205;

      const expected = (i) => {
        var e1 = probabilityOfProvenReoffending(b3 + b2 + b1 + b4 + 1.40256);
        var e2 = probabilityOfProvenReoffending(b3 + b2 + b1 + b4 + 2.1217);

        return [e1, e2][i-1];
      };


      result.should.have.property('OGRS3');
      result.OGRS3.should.have.property('result');
      result.OGRS3.should.have.property('explain');

      (result.OGRS3.explain.currentOffenceFactor.toFixed(4) * 1).should.equal(b4);
      (result.OGRS3.explain.agePolynominalFactor.toFixed(4) * 1).should.equal(b3);
      (result.OGRS3.explain.numberOfSanctionsFactor.toFixed(5) * 1).should.equal(b2);
      (result.OGRS3.explain.copasRate.toFixed(3) * 1).should.equal(b1.toFixed(3) * 1);

      result.OGRS3.result.map((x) => x.toFixed(4)).should.eql([expected(1).toFixed(4), expected(2).toFixed(4)]);
    });

    it('should calculate the same result as the OASYS Oracle P/SQL version for a Female in Custody', function() {
      var result = calcOGRS3({
        coefficients: coefficients,

        gender: 1,                                       // female
        currentOffenceFactor: 0.205,                     // Criminal Damage
        previousSanctions: 5,
        birthDate: (new Date(1972, 8, 9)),
        convictionDate: (new Date(2009, 8, 9)),
        firstSanctionDate: (new Date(1986, 8, 9)),
        assessmentDate: (new Date(2015, 8, 15)),
      });


      result.should.have.property('OGRS3PercentileRisk');
      result.OGRS3PercentileRisk.should.eql([16.98, 29.57]);
    });

    it.skip('should calculate the same result as the OASYS Oracle P/SQL version for a Male not in Custody - PSR - with a negative offence factor', function() {
      var result = calcOGRS3({
        coefficients: coefficients,

        gender: 0,                                       // Male
        currentOffenceFactor: -0.6348,                   // robbery
        previousSanctions: 35,
        birthDate: (new Date(1930, 3, 27)),
        convictionDate: (new Date(2017, 8, 24)),         // 87
        firstSanctionDate: (new Date(1944, 3, 27)),      // 14
        assessmentDate: (new Date(2011, 4, 7)),          // 81
      });


      result.should.have.property('OGRS3PercentileRisk');
      result.OGRS3PercentileRisk.should.eql([15, 27]);
    });

    it.skip('should calculate the same result as the OASYS Oracle P/SQL version for a Male in Custody with a negative offence factor', function() {
      var result = calcOGRS3({
        coefficients: coefficients,

        gender: 0,                                       // Male
        currentOffenceFactor: -0.6348,                   // robbery
        previousSanctions: 19,
        birthDate: (new Date(1972, 11, 07)),
        convictionDate: (new Date(2013, 5, 4)),          // 41
        firstSanctionDate: (new Date(1990, 10, 27)),     // 18
        assessmentDate: (new Date(2015, 1, 12)),         // 43
      });


      result.should.have.property('OGRS3PercentileRisk');
      result.OGRS3PercentileRisk.should.eql([28, 45]);
    });

    it('should calculate the same result as Oracle SQL', function() {
      let b1 = 1.251124464 * ln((5 + 1) / (10 + 37 - 14));
      let b2 = 0.463062792;
      let b3 = -1.524652221;
      let b4 = 0.204960477;

      const expected = (i) => {
        var e1 = probabilityOfProvenReoffending(b3 + b2 + b1 + b4 + 1.402562384);
        var e2 = probabilityOfProvenReoffending(b3 + b2 + b1 + b4 + 2.121705678);

        return [e1, e2][i-1];
      };

      (b1.toFixed(3) * 1).should.equal((-2.13285204315682233189893885145692054877).toFixed(3) * 1);
      (expected(1).toFixed(3) * 1).should.equal((0.1698175324237223856275355124249041581186).toFixed(3) * 1);
      (expected(2).toFixed(3) * 1).should.equal((0.2957162404363142215145090107748713072733).toFixed(3) * 1);
    });
  });
});
