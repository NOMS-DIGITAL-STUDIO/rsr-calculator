
describe('OGRS4 Calculator', function () {
  var calcOGRS4 = require('../lib/').calculateOGRS4;

  describe('With a known set of coefficients', function() {
    var coefficients = require('./data/coefficients.json');

    it('should calculate the correct result for 1st sanction', function() {
      var result = calcOGRS4({
        coefficients: coefficients,

        gender: 0,                                    // male
        currentOffenceType: 0,                        // violence
        previousSanctions: 0,                         // no previous sanctions
        birthDate: (new Date(1997, 01, 01)),
        convictionDate: (new Date(2017, 01, 01)),
        firstSanctionDate: (new Date(2017, 01, 01)),
        sentenceDate: (new Date(2017, 01, 01)),
        assessmentDate: (new Date(2017, 01, 01)),
      });

      result.should.have.property('OGRS4G');
      result.should.have.property('OGRS4V');
      result.OGRS4G.should.have.property('result');
      result.OGRS4V.should.have.property('result');
      result.OGRS4G.result.should.eql([0.20895969900857062, 0.33856913636102487]);
      result.OGRS4V.result.should.eql([0.11420084415651988, 0.1961223960470661]);

      result.should.have.property('OGRS4GPercentileRisk');
      result.should.have.property('OGRS4VPercentileRisk');
      result.OGRS4GPercentileRisk.should.eql([20.9, 33.86]);
      result.OGRS4VPercentileRisk.should.eql([11.42, 19.61]);

    });

    it('should calculate the correct result for 2nd sanction', function() {
      var result = calcOGRS4({
        coefficients: coefficients,

        gender: 0,                                       // male
        currentOffenceType: 0,                        // violence
        previousSanctions: 1,                         // no previous sanctions
        birthDate: (new Date(1997, 01, 01)),
        convictionDate: (new Date(2017, 01, 01)),
        firstSanctionDate: (new Date(2017, 01, 01)),
        sentenceDate: (new Date(2017, 01, 01)),
        assessmentDate: (new Date(2017, 01, 01)),
      });

      result.should.have.property('OGRS4G');
      result.should.have.property('OGRS4V');
      result.OGRS4G.should.have.property('result');
      result.OGRS4V.should.have.property('result');
      result.OGRS4G.result.should.eql([0.9475447462223048, 0.9722248137308649]);
      result.OGRS4V.result.should.eql([0.5437767896835777, 0.692829319958822]);

      result.should.have.property('OGRS4GPercentileRisk');
      result.should.have.property('OGRS4VPercentileRisk');
      result.OGRS4GPercentileRisk.should.eql([94.75, 97.22]);
      result.OGRS4VPercentileRisk.should.eql([54.38, 69.28]);
    });

    it('should calculate the correct result for 3rd sanction', function() {
      var result = calcOGRS4({
        coefficients: coefficients,

        gender: 0,                                       // male
        currentOffenceType: 0,                        // violence
        previousSanctions: 2,                         // no previous sanctions
        birthDate: (new Date(1997, 01, 01)),
        convictionDate: (new Date(2017, 01, 01)),
        firstSanctionDate: (new Date(2017, 01, 01)),
        sentenceDate: (new Date(2017, 01, 01)),
        assessmentDate: (new Date(2017, 01, 01)),
      });

      result.should.have.property('OGRS4G');
      result.should.have.property('OGRS4V');
      result.OGRS4G.should.have.property('result');
      result.OGRS4V.should.have.property('result');
      result.OGRS4G.result.should.eql([0.45489987412438415, 0.6178985661032472]);
      result.OGRS4V.result.should.eql([0.35170668750051676, 0.5065690662599729]);

      result.should.have.property('OGRS4GPercentileRisk');
      result.should.have.property('OGRS4VPercentileRisk');
      result.OGRS4GPercentileRisk.should.eql([45.49, 61.79]);
      result.OGRS4VPercentileRisk.should.eql([35.17, 50.66]);
    });

    it('should calculate the correct result for 4th sanction', function() {
      var result = calcOGRS4({
        coefficients: coefficients,

        gender: 0,                                       // male
        currentOffenceType: 0,                        // violence
        previousSanctions: 3,                         // no previous sanctions
        birthDate: (new Date(1997, 01, 01)),
        convictionDate: (new Date(2017, 01, 01)),
        firstSanctionDate: (new Date(2017, 01, 01)),
        sentenceDate: (new Date(2017, 01, 01)),
        assessmentDate: (new Date(2017, 01, 01)),
      });

      result.should.have.property('OGRS4G');
      result.should.have.property('OGRS4V');
      result.OGRS4G.should.have.property('result');
      result.OGRS4V.should.have.property('result');
      result.OGRS4G.result.should.eql([0.524180632312592, 0.6809907017990864]);
      result.OGRS4V.result.should.eql([0.4280399960243827, 0.5861254735605679]);
    });

    it('should calculate the correct result for 5th sanction', function() {
      var result = calcOGRS4({
        coefficients: coefficients,

        gender: 0,                                       // male
        currentOffenceType: 0,                        // violence
        previousSanctions: 4,                         // no previous sanctions
        birthDate: (new Date(1997, 01, 01)),
        convictionDate: (new Date(2017, 01, 01)),
        firstSanctionDate: (new Date(2017, 01, 01)),
        sentenceDate: (new Date(2017, 01, 01)),
        assessmentDate: (new Date(2017, 01, 01)),
      });

      result.should.have.property('OGRS4G');
      result.should.have.property('OGRS4V');
      result.OGRS4G.should.have.property('result');
      result.OGRS4V.should.have.property('result');
      result.OGRS4G.result.should.eql([0.5823132141312396, 0.72983921949793]);
      result.OGRS4V.result.should.eql([0.4917790452380106, 0.6467849262631117]);
    });
  });
});
