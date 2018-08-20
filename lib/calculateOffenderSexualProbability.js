
// helpers
const Sex = {
  Male: 0,
  Female: 1
};

const dateDiff = (d1, d2) =>
  d1 && d2 ?
  (d1.getFullYear() - d2.getFullYear()) -
  ((d1.getMonth() - d2.getMonth() < 0) || (d1.getMonth() - d2.getMonth() === 0 && d1.getDate() - d2.getDate() < 0) ? 1 : 0) :
  0;

const logisticCurve = x => (ex => ex / (1 + ex))(Math.exp(x));

// private methods

const calcForContactAdult = n =>
  (n === 1) ? 3 : (n === 2) ? 5 : (n > 2) ? 8 : 0;

const calcForContactChild = n =>
  (n === 1) ? 2 : (n === 2) ? 3 : (n > 2) ? 4: 0;

const calcForParaphilia = n =>
  Math.min(3, n || 0);

const calcForSanctions = n =>
  n > 0 ? 3 : 0;

const calcForStrangerVictim = n =>
  n ? 2 : 0;

const calcForAgeAtMostRecentSexualOffence = n =>
  (n > 17) ? 5 : (n > 15) ? 3 : (n > 9) ? 0 : 0;

const calcForAgeAtSentenceDate = n =>
  (n > 59) ? 0 : (n > 53) ? 1 : (n > 47) ? 2 : (n > 41) ? 3 : (n > 35) ? 4 : (n > 29) ? 5 : (n > 23) ? 6 : (n > 9) ? 7 : 0;

const calculateMaleOSPScore = (x) =>
  calcForContactAdult(x.contactAdult) +
  calcForContactChild(x.contactChild) +
  calcForParaphilia(x.paraphilia) +
  calcForSanctions(x.previousSanctions) +
  calcForStrangerVictim(x.hasStrangerVictim) +
  calcForAgeAtMostRecentSexualOffence(x.ageAtMostRecentSexualOffence) +
  calcForAgeAtSentenceDate(x.ageAtSentenceDate);

const calcMaleOffenderSexualProbability = (score) =>
  [-8.817398615, -8.216503478].map((x) => logisticCurve(x + (0.2545385404 * score)));

const calcFemaleOffenderSexualProbability = () =>
  [1 / 193, 1 / 193];

// public methods

const calculateOffenderSexualProbability = (x) => {
  if (x.isMale) {
    let staticScore = calculateMaleOSPScore(x);
    return x.hasSexualElementOrOffence && staticScore > 0 ? calcMaleOffenderSexualProbability(staticScore) : [0, 0];
  }

  return x.hasSexualElementOrOffence ? calcFemaleOffenderSexualProbability() : [0, 0];
};

// public
module.exports = (x) =>
  calculateOffenderSexualProbability({
    isMale: x.sex === Sex.Male,
    sexualOffenceHistory: x.sexualOffenceHistory,
    sexualElement: x.sexualElement,
    hasSexualElementOrOffence: x.sexualOffenceHistory === 0 || x.sexualElement === 0,  // 0 = yes, 1 = no

    // current sexual offence has a stranger victim
    hasStrangerVictim: x.strangerVictim === 0,                   // 0 = yes, 1 = no
    // Number of previous sanctions for all recordable offences
    previousSanctions: parseInt(x.previousSanctions || 0, 10),
    // Number of previous/ current sanctions involving contact child sexual offences
    contactChild: parseInt(x.contactChild || 0, 10),
    // Number of previous/ current sanctions involving contact adult sexual offences
    contactAdult: parseInt(x.contactAdult || 0, 10),
    // Number of previous / current sanctions involving paraphilia sexual offences
    paraphilia: parseInt(x.paraphilia || 0, 10),

    ageAtSentenceDate: dateDiff(x.sentenceDate, x.birthDate),
    ageAtMostRecentSexualOffence: dateDiff(x.mostRecentSexualOffence, x.birthDate),
  });
