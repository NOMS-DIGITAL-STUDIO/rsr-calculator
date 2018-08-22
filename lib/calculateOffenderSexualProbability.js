
// helpers

// logistic regression function
const logisticCurve = x => (ex => ex / (1 + ex))(Math.exp(x));

// private methods

const getScoreForContactAdult = n =>
  (n === 1) ? 3 : (n === 2) ? 5 : (n > 2) ? 8 : 0;

const getScoreForContactChild = n =>
  (n === 1) ? 2 : (n === 2) ? 3 : (n > 2) ? 4: 0;

const getScoreForParaphilia = n =>
  Math.min(3, n || 0);

const getScoreForSanctions = n =>
  n > 0 ? 3 : 0;

const getScoreForStrangerVictim = n =>
  n ? 2 : 0;

const getScoreForAgeAtMostRecentSexualOffence = n =>
  (n > 17) ? 5 : (n > 15) ? 3 : (n > 9) ? 0 : 0;

const getScoreForAgeAtSentenceDate = n =>
  (n > 59) ? 0 : (n > 53) ? 1 : (n > 47) ? 2 : (n > 41) ? 3 : (n > 35) ? 4 : (n > 29) ? 5 : (n > 23) ? 6 : (n > 9) ? 7 : 0;

const calculateOSPStaticScore = (x) =>
  getScoreForContactAdult(x.contactAdult) +
  getScoreForContactChild(x.contactChild) +
  getScoreForParaphilia(x.paraphilia) +
  getScoreForSanctions(x.previousSanctions) +
  getScoreForStrangerVictim(x.hasStrangerVictim) +
  getScoreForAgeAtMostRecentSexualOffence(x.ageAtMostRecentSexualOffence) +
  getScoreForAgeAtSentenceDate(x.ageAtSentenceDate);

const calcMaleOffenderSexualProbability = (score) =>
  [-8.817398615, -8.216503478].map((x) => logisticCurve(x + (0.2545385404 * score)));

const calcFemaleOffenderSexualProbability = () =>
  [1 / 193, 1 / 193];

// public methods

const calculateOffenderSexualProbability = (x) => {
  if (x.isMale) {
    x.OSPStaticScore = calculateOSPStaticScore(x);
    return x.hasSexualElementOrOffence ? calcMaleOffenderSexualProbability(x.OSPStaticScore) : [0, 0];
  }

  return x.hasSexualElementOrOffence ? calcFemaleOffenderSexualProbability() : [0, 0];
};

// public
module.exports = (x) =>
  calculateOffenderSexualProbability({
    isMale: x.isMale,
    hasSexualElementOrOffence: x.hasSexualElementOrOffence,  // 0 = yes, 1 = no

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

    ageAtSentenceDate: x.ageAtSentenceDate,
    ageAtMostRecentSexualOffence: x.ageAtMostRecentSexualOffence,
  });
