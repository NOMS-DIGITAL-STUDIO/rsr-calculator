const fixtureGenerators = require('./helpers/fixtureGenerators');

describe('OGRS3 Calculator', function () {
  var calcOGRS3 = require('../lib').calculateOGRS3;

  describe('With a  criminal history coefficient of 2', function() {
    var coefficients = {
      ogrs3_sanctionoccasions: 2,
    };

    it('should calculate the correct result for 0 sanctions', function() {
      var result = calcOGRS3({
        coefficients: coefficients,
        allSanctions: 0,
      });

      result.should.equal(2);
    });

    it('should calculate the correct result for only 1 sanction', function() {
      var result = calcOGRS3({
        coefficients: coefficients,
        allSanctions: 1,
      });

      result.should.equal(4);
    });

    it('should calculate the correct result for 2 sanctions', function() {
      var result = calcOGRS3({
        coefficients: coefficients,
        allSanctions: 2,
      });

      result.should.equal(6);
    });

    it('should calculate the correct result for 3 sanctions', function() {
      var result = calcOGRS3({
        coefficients: coefficients,
        allSanctions: 3,
      });

      result.should.equal(8);
    });
  });

  describe('With a  criminal history coefficient of -0.0182592921752245', function() {
    var coefficients = {
      ogrs3_sanctionoccasions: -0.0182592921752245,
    };

    it('should calculate the correct result for 0 sanctions', function() {
      var result = calcOGRS3({
        coefficients: coefficients,
        allSanctions: 0,
      });

      result.should.equal(-0.0182592921752245);
    });

    it('should calculate the correct result for only 1 sanction', function() {
      var result = calcOGRS3({
        coefficients: coefficients,
        allSanctions: 1,
      });

      result.should.equal(-0.036518584350449);
    });

    it('should calculate the correct result for 2 sanctions', function() {
      var result = calcOGRS3({
        coefficients: coefficients,
        allSanctions: 2,
      });

      result.should.equal(-0.05477787652567351);
    });

    it('should calculate the correct result for 3 sanctions', function() {
      var result = calcOGRS3({
        coefficients: coefficients,
        allSanctions: 3,
      });

      result.should.equal(-0.073037168700898);
    });
  });

  describe('With a  criminal history coefficient of -0.0147495874606046', function() {
    var coefficients = {
      ogrs3_sanctionoccasions: -0.0147495874606046,
    };

    it('should calculate the correct result for 0 sanctions', function() {
      var result = calcOGRS3({
        coefficients: coefficients,
        allSanctions: 0,
      });

      result.should.equal(-0.0147495874606046);
    });

    it('should calculate the correct result for only 1 sanction', function() {
      var result = calcOGRS3({
        coefficients: coefficients,
        allSanctions: 1,
      });

      result.should.equal(-0.0294991749212092);
    });

    it('should calculate the correct result for 2 sanctions', function() {
      var result = calcOGRS3({
        coefficients: coefficients,
        allSanctions: 2,
      });

      result.should.equal(-0.0442487623818138);
    });

    it('should calculate the correct result for 3 sanctions', function() {
      var result = calcOGRS3({
        coefficients: coefficients,
        allSanctions: 3,
      });

      result.should.equal(-0.0589983498424184);
    });
  });
});
