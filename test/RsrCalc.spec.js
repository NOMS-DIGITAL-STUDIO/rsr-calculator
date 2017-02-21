const should = require('chai').should();
const expect = require('chai').expect;
const Assertion = require('chai').Assertion;

// parse a date in yyyy-mm-dd format
function parseDate(input) {
  if (input == null) { return 'sample data' }
  var parts = String.prototype.split.call(input, '-');

  // new Date(year, month [, day [, hours[, minutes[, seconds[, ms]]]]])
  return new Date(parts[0], parts[1]-1, parts[2]); // Note: months are 0-based
}

// parse dates for the offenderData struct
function replaceStringDatesWithDateObjects(offender_data) {
  var date_type_fields = new Array('birthDate', 'convictionDate', 'sentenceDate', 'firstSanctionDate', 'assessmentDate', 'mostRecentSexualOffence');

  var out = Object.assign({}, offender_data);
  for (var field_key in out) {
    if (date_type_fields.indexOf(field_key) != -1) {
      out[field_key] =  parseDate(out[field_key]);
    }
  }
  return out;
}

function createArrayOfCorrectResults(offender_data) {
  var output_type_fields = new Array('output_sv_static', 'output_sv_dynamic', 'output_male_sex',
                                     'output_non_sex', 'output_female_sex', 'output_rsr_best');

  var out = Object.assign({}, offender_data);
  out.correct_results = {};

  for (var key in output_type_fields) {
    if (out[output_type_fields[key]] != null) {
      out.correct_results[output_type_fields[key]] = out[output_type_fields[key]];
    }
  }
  return out;
}

var addTest = function(i, offender_raw_data) {
  (offender_raw_data['execution'] == true ? it : it.skip)("should pass test number " + i + "  <" + offender_raw_data['pncId'] + ">", function() {
    var offender_data = createArrayOfCorrectResults(replaceStringDatesWithDateObjects(offender_raw_data));
    var result = RSRCalc.calculateScore(offender_data);
    expect(result).toBeValidResult(offender_data);
  });
}

var addListOfTests = function(list_of_tests, json_data) {
  for (index in list_of_tests) {
    var i = list_of_tests[index];
    addTest(i, json_data[i]);
  }
}

function compare(actual, expected, precision) {
  if (precision !== 0) {
    precision = precision || 2;
  }

  return Math.abs(expected - actual) < (Math.pow(10, -precision) / 2)
}

function compare_single_value_with_hash(single, hash) {
  var result = false;
  for (var property in hash.correct_results) {
     var isEqualValue = compare(single, hash.correct_results[property], 8);

     if (isEqualValue) {
       result = true;
     }
   }
   return result;
}

Assertion.addMethod('toBeValidResult', function (expected) {
  var actual = this._obj;

  this.assert(
      compare_single_value_with_hash(actual, expected)
    , "expected #{this} to be comparible to #{exp} but got #{act}"
    , "expected #{this} to not be comparable to #{act}"
    , expected
    , actual
  );
});

const RSRCalc = require('../lib');

describe("RsrCalc", function() {
  describe("manual tests", function() {
    it('should pass for a test with oasys section', function() {
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

        var result = RSRCalc.calculateScore(offender_data);
        expect(result).toBeValidResult(offender_data);
    });

    it('should pass test for X558007 62', function() {
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

      var result = RSRCalc.calculateScore(offender_data);
      expect(result).toBeValidResult(offender_data);

    });

   it('should pass for pncId : G13707 ', function() {
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

      var result = RSRCalc.calculateScore(offender_data);
      expect(result).toBeValidResult(offender_data);

    });

    it('should pass for pncId : A951120 49', function() {
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


        var result = RSRCalc.calculateScore(offender_data);
        expect(result).toBeValidResult(offender_data);

    });
  });

  describe("when testing the sample data from the spreadsheet", function() {
    var json = require('./data/data.json');

    json.forEach((x, i) => addTest(i, x));
  });

  describe("when testing test 704 for indecentImage issue", function() {
    var json = require('./data/data.json');

    list_of_tests = ["704"];

    addListOfTests (list_of_tests, json);
  });

  describe("when testing the issue of sanctionoccasions > 50", function() {
    var json = require('./data/data.json');

    list_of_tests = ["37", "344", "348", "487", "678", "835", "854"];

    addListOfTests (list_of_tests, json);
  });

  describe("when testing the issue of DateDiff for months", function() {
    var json = require('./data/data.json');

    list_of_tests = ["37", "178", "211", "344", "348", "411", "481", "487", "601", "678", "740", "834", "835", "845", "847", "854", "933", "989"];

    addListOfTests (list_of_tests, json);
  });

  describe("when testing the tests with offence_free_months issues <DateDiff>", function() {
    var json = require('./data/data.json');

    list_of_tests = ["31", "148", "150",  "207",  "382",  "434", "477", "649", "826", "951"];

    addListOfTests (list_of_tests, json);
  });


  describe("when running a single test", function() {
    var json = require('./data/data.json');

    list_of_tests = ["999"];

    addListOfTests (list_of_tests, json);
  });
});
