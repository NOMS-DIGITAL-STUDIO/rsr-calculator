const fixtureGenerators = require('./helpers/fixtureGenerators');

const RSRCalc = require('../lib').calculateRisk;

const runTestWithData = fixtureGenerators.runTestWithData(RSRCalc);

describe("Risk Of Serious Recidivism Calculator", () => {
  describe("With a specific Data Set", () => {
    it('should pass for a test with oasys section', runTestWithData({
      birthDate: (new Date(1989,03,22)),
      assessmentDate: (new Date(2013,02,31)), //'2013-03-31'
      offenderTitle: 'Mr',
      firstName: 'lkj',
      familyName: 'lkj',
      sex: 0,
      age: 24,
      pncId: '',
      deliusId: '',
      convictionDate: (new Date(2013,01,20)), //'2013-02-20'
      sentenceDate: (new Date(2013, 01, 31)),
      currentOffenceType: 12,
      sexualElement: 1,
      strangerVictim: '',
      violentOffenceCategory: '',
      firstSanctionDate: (new Date(2001,08,10)), //'2001-09-10'
      previousSanctions: 25,
      violentSanctions: 6,
      sexualOffenceHistory: 1,
      mostRecentSexualOffence: (new Date(1899,11,30)), //'1899-11-30'
      contactAdult: NaN,
      contactChild: NaN,
      indecentImage: NaN,
      paraphilia: NaN,
      oasysInterview: 0,
      useWeapon: 0,
      partner: 1,
      accommodation: 2,
      employment: 0,
      relationship: 1,
      currentUseOfAlcohol: 0,
      bingeDrinking: 0,
      impulsivity: 2,
      temper: 2,
      proCriminal: 2,
      domesticViolence: 0,
      murder: 1,
      wounding: 0,
      kidnapping: 1,
      firearmPossession: 1,
      robbery: 1,
      burglary: 1,
      anyOtherOffence: 0,
      endangerLife: 1,
      arson: 1,
      correct_results: { output_sv_dynamic: 0.08156458710669154 }
    }));
  });
});
