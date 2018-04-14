const fixtureGenerators = require('./helpers/fixtureGenerators');

const RSRCalc = require('../lib').calculateRisk;

const runTestWithData = fixtureGenerators.runTestWithData(RSRCalc);

describe('Risk Of Serious Recidivism Calculator', () => {
  describe('With a specific Data Set', () => {
    it('should pass for pncId : G13707 ', runTestWithData({
      birthDate: (new Date(609202800000)),
      sex: 0,
      pncId: 'G13707',
      currentOffenceType: 12,
      convictionDate: (new Date(1361318400000)),
      sentenceDate: (new Date(1364688000000)),
      sexualElement: 1,
      strangerVictim: null,
      violentOffenceCategory: null,
      firstSanctionDate: (new Date(1000076400000)),
      previousSanctions: 25,
      violentSanctions: 6,
      sexualOffenceHistory: 1, // This should be 1 = FALSE
      mostRecentSexualOffence: new String('sample data'),
      contactAdult: 0,
      contactChild: 0,
      indecentImage: 0,
      paraphilia: 0,
      murder: 1,
      wounding: 0,
      burglary: 1,
      arson: 1,
      endagerLife: 1,
      kidnapping: 1,
      firearmPossession: 1,
      robbery: 1,
      anyOtherOffence: 0,
      oasysInterview: 0,
      useWeapon: 0,
      partner: 1,
      accommodation: 2,
      employment: 0,
      relationship: 1,
      domesticViolence: 0,
      currentUseOfAlcohol: 0,
      bingeDrinking: 0,
      impulsivity: 2,
      temper: 2,
      proCriminal: 2,
      correct_results: { output_sv_dynamic: 0.0815645871066921 },
      assessmentDate: (new Date(1364688000000))
    }));
  });
});
