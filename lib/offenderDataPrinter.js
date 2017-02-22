const FIELDS_TO_OUTPUT = [
   "testNumber",
    "execution",
    "birthDate",
    "sex",
    "pncId",
    "currentOffenceType",
    "convictionDate",
    "sentenceDate",
    "sexualElement",
    "strangerVictim",
    "violentOffenceCategory",
    "firstSanctionDate",
    "allSanctions",
    "violentSanctions",
    "sexualOffenceHistory",
    "mostRecentSexualOffence",
    "contactAdult",
    "contactChild",
    "indecentImage",
    "paraphilia",
    "murder",
    "wounding",
    "burglary",
    "arson",
    "endagerLife",
    "kidnapping",
    "firearmPossession",
    "robbery",
    "anyOtherOffence",
    "oasysInterview",
    "useWeapon",
    "partner",
    "accommodation",
    "employment",
    "relationship",
    "domesticViolence",
    "currentUseOfAlcohol",
    "bingeDrinking",
    "impulsivity",
    "temper",
    "proCriminal",
    "output_sv_static",
    "output_sv_dynamic",
    "output_male_sex",
    "output_non_sex",
    "output_female_sex",
    "output_rsr_best",
    "assessmentDate",
];

const DATE_TYPE_FIELDS = [
  'birthDate',
  'convictionDate',
  'sentenceDate',
  'firstSanctionDate',
  'assessmentDate',
  'mostRecentSexualOffence',
];

const printSortedOffenderData = (offender) => {
  var keys = [];
  for (var k in offender) {
    if (offender.hasOwnProperty(k)) keys.push(k);
  }
  keys.sort();

  for (var i = 0, len = keys.length; i < len; i++) {
    var field_key = keys[i];
    if (~FIELDS_TO_OUTPUT.indexOf(field_key)) {
      try {
        var date_in_readable_format = "";
        var value = offender[field_key];

        /*
        if (field_key === 'birthDate') {
        value = offender.birthDate;
        }
        if (field_key === 'assessmentDate') {
        value = offender.assessmentDate;
        }
        */

        if (~DATE_TYPE_FIELDS.indexOf(field_key)) {
         date_in_readable_format = " date shown: " + value;
         value = JSON.stringify(value);
        }

        console.log(field_key + " : " + value + date_in_readable_format);        }
      catch (e) {
        console.log("Error while retrieving value for " + field_key);
      }
    }
  }
};

// public

module.exports = offenderDataPrinter;
