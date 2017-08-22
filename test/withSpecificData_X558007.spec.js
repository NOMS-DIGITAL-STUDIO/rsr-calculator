const fixtureGenerators = require('./helpers/fixtureGenerators');

const RSRCalc = require('../lib').calculateRisk;

const runTestWithData = fixtureGenerators.runTestWithData(RSRCalc);

describe("Risk Of Serious Recidivism Calculator", () => {
  describe("With a specific Data Set", () => {
    it('should pass test for X558007 62', runTestWithData({
      birthDate:(new Date(171068400000)),
      sex:1,
      pncId:'X558007 62',
      currentOffenceType:13,
      convictionDate:(new Date(1352160000000)),
      sentenceDate:(new Date(1352764800000)),
      sexualElement:1,
      strangerVictim:null,
      violentOffenceCategory:'',
      firstSanctionDate:(new Date(875746800000)),
      previousSanctions:4,
      violentSanctions:2,
      sexualOffenceHistory:1,
      mostRecentSexualOffence:'',
      contactAdult:0,
      contactChild:0,
      indecentImage:0,
      paraphilia:0,
      murder:1,
      wounding:1,
      burglary:1,
      arson:1,
      endagerLife:1,
      kidnapping:1,
      firearmPossession:1,
      robbery:1,
      anyOtherOffence:1,
      oasysInterview:0,
      useWeapon:1,
      partner:1,
      accommodation:0,
      employment:1,
      relationship:1,
      domesticViolence:1,
      currentUseOfAlcohol:0,
      bingeDrinking:0,
      impulsivity:1,
      temper:1,
      proCriminal:0,
      correct_results: { output_sv_dynamic: 0.0033205206464270703 },
      assessmentDate:(new Date(1364688000000))
    }));
  });
});
