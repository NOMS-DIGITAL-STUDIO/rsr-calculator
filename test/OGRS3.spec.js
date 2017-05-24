const fixtureGenerators = require('./helpers/fixtureGenerators');

describe('OGRS3 Calculator', function () {
  var calcOGRS3 = require('../lib/').calculateOGRS3;

  describe('With a  criminal history coefficient of 2', function() {
    var coefficients = {
      OGRS3: {
        offenceCategoriesLookup: [
          0,
          -0.5908,
          0.1772,
          0.0368,
          -0.6323,
          0.7548,
          -0.1188,
          0.2382,
          0.6575,
          0.3503,
          0.1552,
          0.7334,
          0.3779,
          0.4224,
          -0.129,
          0.2599,
          0.2023,
          -0.7608,
          0.0788,
          -0.0599
        ],

        ageGroupLookup: [
          // male / female
          [-0.0617, -0.9617],// 16 to under 18
          [-0.6251, -0.8994],// 18 to under 21
          [-1.0485, -1.0315],// 21 to under 25
          [-1.1592, -1.0543],// 25 to under 30
          [-1.3166, -1.1283],// 30 to under 35
          [-1.3527, -1.4186],// 35 to under 40
          [-1.4837, -1.5243],// 40 to under 50
          [-2.0071, -2.4469],// 50 and over
        ],

        firstTimeOffender: 0.12614,
        repeatOffender: 0.46306,

        copas: 1.25112,
      },
    };

    it('should calculate the correct result for 1 sanctions', function() {
      var result = calcOGRS3({
        coefficients: coefficients,

        sex: 0,                                       // male
        offenceGroup: 0,                              // violence
        allSanctions: 0,                              // no previous sanctions
        birthDate: (new Date(1997, 01, 01)),
        convictionDate: (new Date(2017, 01, 01)),
        firstSanctionDate: (new Date(2017, 01, 01)),
        assessmentDate: (new Date(2017, 01, 01)),
      });

      result.should.have.property('OGRS3');
      result.OGRS3.should.eql([0.12161653992755769,0.22130626481056737]);
    });
/*
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
    */
  });
});
