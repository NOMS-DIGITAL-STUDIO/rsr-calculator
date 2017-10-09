const fixtureGenerators = require('./helpers/fixtureGenerators');

const RSRCalc = require('../lib').calculateRisk;

const runTestWithData = fixtureGenerators.runTestWithData(RSRCalc);

describe("Risk Of Serious Recidivism Calculator", () => {
  describe("With a specific Data Set", () => {
    it('should pass for pncId : A951120 49', runTestWithData({
      birthDate: (new Date(-142131600000)),
      sex: 0,
      pncId: 'A951120 49',
      currentOffenceType: 19,
      convictionDate: (new Date(1358121600000)),
      sentenceDate: (new Date(1358121600000)),
      sexualElement: 1,
      strangerVictim: null,
      violentOffenceCategory: null,
      firstSanctionDate: (new Date(434674800000)),
      previousSanctions: 6,
      violentSanctions: 2,
      sexualOffenceHistory: 0, //This should be zero => YES (THIS IS TRUE in spreadsheet)
      mostRecentSexualOffence: (new Date(603504000000)),
      contactAdult: 0,
      contactChild: 1,
      indecentImage: 0,
      paraphilia: 0,
      murder: 1,
      wounding: 1,
      burglary: 1,
      arson: 1,
      endangerLife: 1,
      kidnapping: 1,
      firearmPossession: 1,
      robbery: 1,
      anyOtherOffence: 1,
      oasysInterview: 1, //This was 1
      useWeapon: 1,
      partner: 1,
      accommodation: null,
      employment: 1,
      relationship: 0, //This should be 0
      domesticViolence: 1,
      currentUseOfAlcohol: null,
      bingeDrinking: null,
      impulsivity: 0, //This should be 0
      temper: null,
      proCriminal: null,
      output_sv_static: 0.003930976543400244,
      output_sv_dynamic: null,
      output_male_sex: 0.007336699485567033,
      output_non_sex: null,
      output_female_sex: null,
      output_rsr_best: 0.014743676028967277,
      correct_results: { output_sv_dynamic: 0.014743676033473825 },
      assessmentDate: (new Date(1364688000000))
    }));
  });
});
