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

// helpers
const getSortedKeyList = (x) => {
  var keys = [];
  for (var k in x) {
    if (x.hasOwnProperty(k)) keys.push(k);
  }
  keys.sort();
  return keys;
};


// public

module.exports = (x) => {
  var keys = getSortedKeyList(x);

  var out = [];
  keys.forEach((key) => {
    if (!~FIELDS_TO_OUTPUT.indexOf(key)) return;

    var value = x[key];

    try {
      value = JSON.stringify(value);
    }
    catch (e) {
      console.error('Error while parsing value "' + value + '" for <' + key + '>');
    }

    out.push(key + ': ' + value );
  });

  return out;
};
