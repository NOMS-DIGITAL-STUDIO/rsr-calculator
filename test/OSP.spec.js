// const fixtureGenerators = require('./helpers/fixtureGenerators');

describe('OSP Calculator', function () {
  var calcOSP = require('../lib/').calculateOSP;

  describe('With a known set of inputs', function () {
      /*
      {"sex":"0","birthDate":"1961-03-01T00:00:00.000Z","sentenceDate":"2018-03-16T00:00:00.000Z","sexualElement":"0","strangerVictim":"1","previousSanctions":4,"sexualOffenceHistory":"1","mostRecentSexualOffence":"2018-02-23T00:00:00.000Z","contactAdult":0,"contactChild":1,"indecentImage":1,"paraphilia":0
      }
       */
      it('should calculate the correct result', function () {

        /*
            "indecentImageProbability": [
          0.018237,
          0.02805
      ],
      "contactSexualProbability": [
          0.0024298942966885814,
          0.004422668592483823
      ],
         */

        var result = calcOSP({
          sex: 'MALE',
          hasSexualHistory: true,
          dateOfBirth: (new Date(1961, 3, 1)),
          sentenceDate: (new Date(2018, 3, 16)),
          hasStrangerVictim: false,
          numberOfPreviousSanctions: 4,
          numberOfSanctionsChildContact: 1,
          numberOfSanctionsAdultContact: 0,
          numberOfSanctionsParaphilia: 0,
          numberOfSanctionsIndecentImages: 1,
          mostRecentSexualOffenceDate: (new Date(2018, 2, 23)),
        });

        result.should.have.property('sexualContactProbability');
        result.should.have.property('indecentImageProbability');

        result.sexualContactProbability.should.eql([
          0.0024298942966885814,
          0.004422668592483823
        ]);

        result.indecentImageProbability.should.eql([
          0.018237,
          0.02805
        ]);
      });
    }
  );
});
