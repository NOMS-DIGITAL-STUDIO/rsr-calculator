const should = require('chai').should();
const expect = require('chai').expect;
const Assertion = require('chai').Assertion;

const RSRCalc = require('../lib/riskOfSeriousRecidivismCalculator');
const fixtures = require('./data/data.json');

const EXPECTEED_PRECISION = 8;

const DATE_TYPE_FIELDS = [
  'birthDate',
  'convictionDate',
  'sentenceDate',
  'firstSanctionDate',
  'assessmentDate',
  'mostRecentSexualOffence'
];

const OUTPUT_TYPE_FIELDS = [
  'output_sv_static',
  'output_sv_dynamic',
  'output_male_sex',
  'output_non_sex',
  'output_female_sex',
  'output_rsr_best'
];

// Assertion Helper

const withinExpectedPrecision = (p) => (x, e, p) =>
  Math.abs(e - x) < (Math.pow(10, -((p !== 0) ? p = p || 2 : p)) / 2);

const compare_single_value_with_correct_results = (v, expected, precision) => {
  var assertIsEqual = withinExpectedPrecision(precision);

  var result = false;
  for (var property in expected) {
     if (assertIsEqual(v, expected[property])) {
       result = true;
     }
   }
   return result;
}

Assertion.addMethod('toBeWithinExpectedTolerance', function (expected, precision) {
  this.assert(
      compare_single_value_with_correct_results(this._obj, expected.correct_results, precision)
    , "expected #{this} to be comparible to #{exp} but got #{act}"
    , "expected #{this} to not be comparable to #{act}"
    , expected.correct_results
    , this._obj
  );
});

// fixture generators

const parseDate = (input) => {
  var parts = String.prototype.split.call(input || 'sample data', '-');
  return parts.length === 3 ? new Date(parts[0], parts[1]-1, parts[2]) : parts[0];
}

const cloneWithDateObjects = (x) => {
  var out = {};
  for (var key in x) out[key] = ~DATE_TYPE_FIELDS.indexOf(key) ? parseDate(x[key]) : x[key];
  return out;
};

const createCorrectResultsObject = (x) => {
  var out = {};
  OUTPUT_TYPE_FIELDS.forEach((key) => (x[key] || x[key] === false) && (out[key] = x[key]));
  return out;
};

const formatOffenderRawData = (x) =>
  Object.assign(cloneWithDateObjects(x), { correct_results: createCorrectResultsObject(x) });

const addTest = (i, offender_raw_data) => {
  (offender_raw_data['execution'] == true ? it : it.skip)("should pass test number " + i + "  <" + offender_raw_data['pncId'] + ">", function() {
    var offender_data = formatOffenderRawData(offender_raw_data);
    var result = RSRCalc(offender_data);
    expect(result).toBeWithinExpectedTolerance(offender_data, EXPECTEED_PRECISION);
  });
}

const addListOfTests = (fixtures) =>
  fixtures.forEach((fixture, i) => addTest(i, fixture));

const addFilteredListOfTests = (fixtures, ids) =>
  ids.forEach((id) => addTest(id, fixtures[id]));

describe("Risk Of Serious Recidivism Calculator", () => {
  describe("manual tests", () => {
    it('should pass for a test with oasys section', () => {
      var offender_data = {
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
        allSanctions: 25,
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
        endagerLife: 1,
        arson: 1,
        correct_results: { output_sv_dynamic: 0.08156458710669154 }
      };

      var result = RSRCalc(offender_data);
      expect(result).toBeWithinExpectedTolerance(offender_data, EXPECTEED_PRECISION);
    });

    it('should pass test for X558007 62', () => {
      var offender_data = {
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
        allSanctions:4,
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
      };

      var result = RSRCalc(offender_data);
      expect(result).toBeWithinExpectedTolerance(offender_data, EXPECTEED_PRECISION);
    });

   it('should pass for pncId : G13707 ', () => {
      var offender_data = {
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
        allSanctions: 25,
        violentSanctions: 6,
        sexualOffenceHistory: 1, // This should be 1 = FALSE
        mostRecentSexualOffence: (new String("sample data")),
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
      };

      var result = RSRCalc(offender_data);
      expect(result).toBeWithinExpectedTolerance(offender_data, EXPECTEED_PRECISION);
    });

    it('should pass for pncId : A951120 49', () => {
        var offender_data = {
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
          allSanctions: 6,
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
          endagerLife: 1,
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
        };

        var result = RSRCalc(offender_data);
        expect(result).toBeWithinExpectedTolerance(offender_data, EXPECTEED_PRECISION);
    });
  });

  describe("when testing the sample data from the spreadsheet",
    () => addListOfTests(fixtures));

  describe("when testing test 704 for indecentImage issue",
    () => addFilteredListOfTests(fixtures, ["704"]));

  describe("when testing the issue of sanctionoccasions > 50",
    () => addFilteredListOfTests(fixtures, ["37", "344", "348", "487", "678", "835", "854"]));

  describe("when testing the issue of DateDiff for months",
    () => addFilteredListOfTests(fixtures, ["37", "178", "211", "344", "348", "411", "481", "487", "601", "678", "740", "834", "835", "845", "847", "854", "933", "989"]));

  describe("when testing the tests with offence_free_months issues <DateDiff>",
    () => addFilteredListOfTests(fixtures, ["31", "148", "150",  "207",  "382",  "434", "477", "649", "826", "951"]));

  describe("when running a single test",
    () => addFilteredListOfTests(fixtures, ["999"]));
});
