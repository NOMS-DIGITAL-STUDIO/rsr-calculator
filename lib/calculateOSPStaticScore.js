
const lookupScoreForContactAdult = n =>
  (n === 1) ? 3 : (n === 2) ? 5 : (n > 2) ? 8 : 0;

const lookupScoreForContactChild = n =>
  (n === 1) ? 2 : (n === 2) ? 3 : (n > 2) ? 4: 0;

const lookupScoreForParaphilia = n =>
  Math.min(3, n || 0);

const lookupScoreForSanctions = n =>
  n > 0 ? 3 : 0;

const lookupScoreForStrangerVictim = n =>
  n ? 2 : 0;

const lookupScoreForAgeAtMostRecentSexualOffence = n =>
  (n > 17) ? 5 : (n > 15) ? 3 : (n > 9) ? 0 : 0;

const lookupScoreForAgeAtRiskDate = n =>
  (n > 59) ? 0 : (n > 53) ? 1 : (n > 47) ? 2 : (n > 41) ? 3 : (n > 35) ? 4 : (n > 29) ? 5 : (n > 23) ? 6 : (n > 9) ? 7 : 0;

const calculateMaleOSPStaticScore = x =>
  0 +
    lookupScoreForContactAdult(x.contactAdult) +
    lookupScoreForContactChild(x.contactChild) +
    lookupScoreForParaphilia(x.paraphilia) +
    lookupScoreForSanctions(x.previousSanctions) +
    lookupScoreForStrangerVictim(x.hasStrangerVictim) +
    lookupScoreForAgeAtMostRecentSexualOffence(x.ageAtMostRecentSexualOffence) +
    lookupScoreForAgeAtRiskDate(x.ageAtRiskDate);

// public methods

const calculateOSPStaticScore = x =>
  x.hasSexualHistory && x.isMale ? calculateMaleOSPStaticScore(x) : 0;

// public
module.exports = x =>
  calculateOSPStaticScore({
    isMale: x.isMale,
    hasSexualHistory: x.hasSexualHistory,
    ageAtMostRecentSexualOffence: x.ageAtMostRecentSexualOffence,
    ageAtRiskDate: x.ageAtRiskDate,

    // current sexual offence has a stranger victim
    hasStrangerVictim: x.strangerVictim === 0,               // 0 = yes, 1 = no

    // Number of previous sanctions for all recordable offences
    previousSanctions: parseInt(x.previousSanctions || 0, 10),
    // Number of previous/ current sanctions involving contact child sexual offences
    contactChild: parseInt(x.contactChild || 0, 10),
    // Number of previous/ current sanctions involving contact adult sexual offences
    contactAdult: parseInt(x.contactAdult || 0, 10),
    // Number of previous / current sanctions involving paraphilia sexual offences
    paraphilia: parseInt(x.paraphilia || 0, 10),
  });
