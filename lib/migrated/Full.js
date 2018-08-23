
const logit = n => Math.exp(n) / (1 + Math.exp(n));

const DateTime = {
  getMonth(d) {
    return new Date(d).getMonth();
  },

  getYear(d) {
    return new Date(d).getYear();
  },

  getDay(d) {
    return new Date(d).getDate();
  },

  yearDiff(start, end) {
    return (end.getFullYear() - start.getFullYear()) -
      ((end.getMonth() - start.getMonth() < 0) || (end.getMonth() - start.getMonth() === 0 && end.getDate() - start.getDate() < 0) ? 1 : 0);
  },

  monthDiff(start, end) {
    return ((end.getFullYear() - start.getFullYear()) * 12) + (end.getMonth() - start.getMonth());
  }
};

const calculateCareerStatus = x => {
  if (x.previousSanctions === 0) {
    return 'First-time entrant';
  }

  if (x.previousSanctions === 1) {
    return 'Second-time entrant (' + x.gender + ')';
  }

  return 'Repeat offender (' + x.gender + ')';
};

const calculateCareerStatusViolent = x => {
  if (x.previousSanctionsForViolentOffences === 0) {
    return 'Never violent (' + x.gender + ')';
  }

  if (x.previousSanctionsForViolentOffences === 1) {
    return 'Once violent';
  }

  return 'Repeat violent offender';
};

let StoreInputs = {
  getOtherVariables(x) {
    if (x.offenderHasSexualOffenceHistory) {
      x.ageAtMostRecentSexualOffence = DateTime.getYearDiff(x.dateOfBirth, x.dateOfMostRecentSexualOffence);
    }

    Object.assign(x, {
      ageAtRiskDate: DateTime.getYearDiff(x.dateOfBirth, x.dateOfSentenceOrDischarge),
      ageIndex: DateTime.getYearDiff(x.dateOfBirth, x.dateOfSentenceOrDischarge),
      ageFirSanc: DateTime.getYearDiff(x.dateOfBirth, x.dateOfFirstSanction),
      ageCurSanc: DateTime.getYearDiff(x.dateOfBirth, x.dateOfCurrentConviction),
    });

    //the offence free months has an upper bound of 36 and a lower bound of 0
    x.offFree = Math.min(36, Math.max(0,
      DateTime.getMonthDiff(x.dateOfSentenceOrDischarge, x.dateOfAssessment) -
        (DateTime.getDay(x.dateOfSentenceOrDischarge) <= DateTime.getDay(x.dateOfAssessment)) ? 0 : 1));

    Object.assign(x, {
      yearsCrim: x.ageCurSanc - x.ageFirSanc,
      copasScoreGen: Math.log((1 + x.previousSanctions) / (getRange('OGRS4GCopasDenom') + x.ageCurSanc - x.ageFirSanc)),
      VcopasScoreGen: Math.log((1 + x.previousSanctions) / (getRange('OGRS4VCopasDenom') + x.ageCurSanc - x.ageFirSanc)),
    });

    x.VcopasScoreViolent = (x.previousSanctionsForViolentOffences > 0) ?
      Math.log((x.previousSanctionsForViolentOffences) / (getRange('OGRS4VCopasDenomViolent') + x.ageCurSanc - x.ageFirSanc)) :0;

    Object.assign(x, {
      careerStatus: calculateCareerStatus(x),
      careerStatusViolent: calculateCareerStatusViolent(x),

      offenderHasSexualOffenceHistory: (x.contactAdult +
                                        x.contactChild +
                                        x.indecentImage +
                                        x.paraphilia > 0),

      offenderIsFemale: x.gender === 'Female',
      offenderIsMale: x.gender === 'Male',
    });

    return x;
  },
};

let OSP = {
  getOSPStaticScore(x) {
    return 0 +
      //Add to the score depending on how many of each sexual offence the offender has commited
      getScoreForContactAdult(x.contactAdult) +
      getScoreForContactChild(x.contactChild) +
      getScoreForParaphilia(x.paraphilia) +
      getScoreForSanctions(x.previousSanctions) +

      //Add to the score if the victim was a stranger
      getScoreForStrangerVictim(x.hasStrangerVictim) +

      //Add to the score depending on the age of most recent sexual offence
      getScoreForAgeAtMostRecentSexualOffence(x.ageAtMostRecentSexualOffence) +

      //Add to the score depending on what age the offender will be on their Date of discharge/sentencing of a community order
      getScoreForageAtRiskDate(x.ageAtRiskDate);
  },

  getOSP(x) {
    // if the offender is male with a sexual offence history
    if (x.offenderIsMale && x.offenderHasSexualOffenceHistory) {
      x.OSPStaticScore = OSP.getOSPStaticScore(x);

      //Output
      x.OSPScore = [
        getRange('a_1Year') + x.OSPStaticScore * getRange('OSPFactor'),
        getRange('a_2Year') + x.OSPStaticScore * getRange('OSPFactor')
      ]
      .map(logit);
    }

    return x;
  },
};

let OGRS4G = {
  getOGRS4GStaticScore(x) {
    return 0 +
      //Add a constant depending on the offenders gender
      lookupParameter(x.gender, 'Constant') +

      //A quartic equation which uses the offenders age at the Date of discharge/sentencing of a community order
      (x.ageIndex * lookupParameter(x.gender, 'AgeIndexFactor')) +
        (Math.pow(x.ageIndex, 2) * lookupParameter(x.gender, 'AgeIndexFactor')) +
          (Math.pow(x.ageIndex, 3) * lookupParameter(x.gender, 'AgeIndexFactor')) +
            (Math.pow(x.ageIndex, 4) * lookupParameter(x.gender, 'AgeIndexFactor')) +

      //Uses the type of offence the offender has commited
      lookupParameter(x.typeOfCurrentOffence, 'OffenceGroup') +

      //Score depending on whether the offender is a first, second or repeat offender
      lookupParameter(x.careerStatus, 'CareerStatus') +

      //Score depending on the number of previous sanctions
      //Add 1 to include the current offence
      ((x.previousSanctions + 1) * getRange('SanctionsFactor')) +

      //Score changes depending on how many years between the first sanction and the current sanction
      ((x.ageCurSanc - x.ageFirSanc) * lookupParameter(x.careerStatus, 'YearsSinceFirstFactor')) +

      //Score changes depending on the copas score
      (x.copasScoreGen * lookupParameter(x.careerStatus, 'CopasFactor')) +
        (Math.pow(x.copasScoreGen, 2) * lookupParameter(x.careerStatus, 'CopasFactor')) +

      //A quartic equations which uses the number of offence free months
      (x.offFree * getRange('OffenceFreeFactor')(1, 1)) +
        (Math.pow(x.offFree, 2) * getRange('OffenceFreeFactor')(1, 2)) +
          (Math.pow(x.offFree, 3) * getRange('OffenceFreeFactor')(1, 3)) +
            (Math.pow(x.offFree, 4) * getRange('OffenceFreeFactor')(1, 4));
  },

  getOGRS4G(x) {
    x.OGRS4GStaticScore = OGRS4G.getOGRS4GStaticScore(x);

    let Scores = [
      getRange('OGRS4G_1Year') + x.OGRS4GStaticScore,
      getRange('OGRS4G_2Year') + x.OGRS4GStaticScore
    ]
    .map(logit);

    x.OGRS4GScore = Scores;

    return x;
  },
};

let OGRS4V = {
  getOGRS4VStaticScore(x) {
    return 0 +
      //Add a constant depending on the offenders gender
      lookupParameter(x.gender, 'VConstant') +

      //A quartic equation which uses the offenders age at the Date of discharge/sentencing of a community order
      (x.ageIndex * lookupParameter(x.gender, 'VAgeIndexFactor')) +
        (Math.pow(x.ageIndex, 2) * lookupParameter(x.gender, 'VAgeIndexFactor')) +
          (Math.pow(x.ageIndex, 3) * lookupParameter(x.gender, 'VAgeIndexFactor')) +
            (Math.pow(x.ageIndex, 4) * lookupParameter(x.gender, 'VAgeIndexFactor')) +

      //Uses the type of offence the offender has commited
      lookupParameter(x.typeOfCurrentOffence, 'VOffenceGroup') +

      //Score depending on whether the offender is a first, second or repeat offender
      lookupParameter(x.careerStatus, 'VCareerStatus') +

      //Score depending on the number of previous sanctions
      //Add 1 to include the current offence
      ((x.previousSanctions + 1) * getRange('VSanctionsFactor')) +

      //Score changes depending on how many years between the first sanction and the current sanction
      ((x.ageCurSanc - x.ageFirSanc) * lookupParameter(x.careerStatus, 'VYearsSinceFirstFactor')) +

      //Score changes depending on the copas score
      (x.VcopasScoreGen * lookupParameter(x.careerStatus, 'VCopasFactor')) +
        (Math.pow(x.VcopasScoreGen, 2) * lookupParameter(x.careerStatus, 'VCopasFactor')) +

      //A quartic equations which uses the number of offence free months
      (x.offFree * getRange('VOffenceFreeFactor')(1, 1)) +
        (Math.pow(x.offFree, 2) * getRange('VOffenceFreeFactor')(1, 2)) +
          (Math.pow(x.offFree, 3) * getRange('VOffenceFreeFactor')(1, 3)) +
            (Math.pow(x.offFree, 4) * getRange('VOffenceFreeFactor')(1, 4)) +

      //Add a constant to the score depending on the offenders number of previous violent offences
      lookupParameter(x.careerStatusViolent, 'VCareerStatusViolent') +

      //Multiply the number of violent offences by a factor and add to the score
      (x.previousSanctionsForViolentOffences * getRange('VSanctionsFactorViolent')) +

      //Multiply the offenders violent copas score by a factor and add it to the score if the offender has previous violent sanctions
      (
        x.previousSanctionsForViolentOffences > 0 ?
          x.VcopasScoreViolent * getRange('VCopasFactorViolent') : 0
      );
  },

  getOGRS4V(x) {
    x.OGRS4VStaticScore = OGRS4V.getOGRS4VStaticScore(x);

    //Output
    let Scores = [
      getRange('OGRS4V_1Year') + x.OGRS4VStaticScore,
      getRange('OGRS4V_2Year') + x.OGRS4VStaticScore
    ]
    .map(logit);

    x.OGRS4VScore = Scores;

    return x;
  },
};

let OGP2 = {
  getOGP2StaticScore(x) {
    return 0 +
      //A quartic equation which uses the offenders age at the Date of discharge/sentencing of a community order
      (x.ageIndex * lookupParameter(x.gender, 'OGP2AgeIndex')) +
        (Math.pow(x.ageIndex, 2) * lookupParameter(x.gender, 'OGP2AgeIndex')) +
          (Math.pow(x.ageIndex, 3) * lookupParameter(x.gender, 'OGP2AgeIndex')) +
            (Math.pow(x.ageIndex, 4) * lookupParameter(x.gender, 'OGP2AgeIndex')) +

      //Add a constant depending on the offenders gender
      lookupParameter(x.gender, 'OGP2Sex') +

      //Add a constant depending on the type of offence the offender has commited
      lookupParameter(x.typeOfCurrentOffence, 'OGP2OffenceType') +

      //Add a constant depending on whether the offender has previous sanctions
      lookupParameter(x.previousSanctions, 'OGP2Sanctions') +

      //Multiply the number of convictions by a factor and add to the score
      //Add 1 to include the current offence
      (x.previousSanctions + 1 * getRange('OGP2SanctionFactor')) +

      //if it is the offenders second offence add a constant to the score
      (
        x.previousSanctions === 1 ?
        x.yearsCrim * lookupParameter(x.gender, 'OGP2SecondYears') : 0
      ) +

      //A quadradratic equation which multiplys the number of offence free months by factors
      (x.offFree * getRange('OGP2OffFree')(1, 1)) +
        (Math.pow(x.offFree, 2) * getRange('OGP2OffFree')(1, 2)) +

      //if the offender lives with their partner add a constant
      //Also add the interaction between living with partner and relationship with partner
      (
        x.offenderUsuallyLivesWithParents === true ?
          getRange('OGP2OASys')(1, 2) + x.currentRelationshipWithPartner * getRange('OGP2OASys')(5, 2) : 0
      ) +

      //Add scores for the rest of the OASys questions
      (x.offenderIsLivingInSuitableAccomodation * getRange('OGP2OASys')(2, 2));

      (x.offenderIsUnemployedOrWillBeOnRelease === true ? 2 * getRange('OGP2OASys')(3, 2) : 0) +

      (x.currentRelationshipWithPartner * getRange('OGP2OASys')(4, 2)) +

      (x.evidenceOfDomesticViolencePartnerAbuse === true ? getRange('OGP2OASys')(6, 2) : 0) +

      (x.regularActivitiexEncourageOffending * getRange('OGP2OASys')(7, 2)) +
      (x.offenderHasMotivationToTackleDrugMisuse * getRange('OGP2OASys')(8, 2)) +
      (x.offenderHasAlchoholProblem * getRange('OGP2OASys')(9, 2)) +
      (x.offenderHasEvidenceOfBingeDrinkingOrExcessiveAlchohol * getRange('OGP2OASys')(10, 2)) +
      (x.offenderHasImpulsivityProblem * getRange('OGP2OASys')(11, 2)) +
      (x.offenderHasProCriminalAttitudes * getRange('OGP2OASys')(12, 2)) +

      //Add a score depending on what drugs the offender uses
      lookupParameter(x.mostOftenUsedDrug, 'OGP2Drugs') +

      //Add a constant in the offender uses drugs daily
      lookupParameter(x.offenderUsesDrugDaily, 'OGP2DailyDrug');
  },

  getOGP2(x) {
    if (x.offenderHasHadAnOffenderInterviewOrOASys) {
      x.OGP2StaticScore = OGP2.getOGP2StaticScore(x);

      //Create new variables which hold the 1 and 2 year reoffending scores
      let Scores = [
        x.OGP2StaticScore + getRange('OGP2Intercept')(1, 1),
        x.OGP2StaticScore + getRange('OGP2Intercept')(1, 2)
      ];

      //if the number of sanctions is 3 or more { multiply the copas score by a factor and add to the score
      if (x.previousSanctions > 1) {
        Scores = Scores.map(n => n +
                    (x.copasScoreGen * lookupParameter(x.gender, 'OGP2ThirdOGRS4G')) +
                    (x.copasScoreGen * x.copasScoreGen * lookupParameter(x.gender, 'OGP2ThirdOGRS4G')));
      }

      x.OGP2Score = Scores.map(logit);
    }

    return x;
  },
};

let OVP2 = {
  getOVP2StaticScore(x) {
    return 0 +
      //A quartic equation which uses the offenders age at the Date of discharge/sentencing of a community order
      (x.ageIndex * lookupParameter(x.gender, 'OVP2AgeIndex')(2, false)) +
        (Math.pow(x.ageIndex, 2) * lookupParameter(x.gender, 'OVP2AgeIndex')(3, false)) +
          (Math.pow(x.ageIndex, 3) * lookupParameter(x.gender, 'OVP2AgeIndex')(4, false)) +
            (Math.pow(x.ageIndex, 4) * lookupParameter(x.gender, 'OVP2AgeIndex')(5, false)) +

      //Add a constant depending on the offenders gender
      lookupParameter(x.gender, 'OVP2Sex')(2, false) +

      //Add a constant depending on the type of offence the offender has commited
      lookupParameter(x.typeOfCurrentOffence, 'OVP2OffenceType')(2, false) +

      //Add a constant depending on whether the offender has previous sanctions
      lookupParameter(x.previousSanctions, 'OVP2Sanctions')(2, true) +

      //Multiply the number of convictions by a factor and add to the score
      //Add 1 to include the current offence
      ((x.previousSanctions + 1) * getRange('OVP2SanctionFactor')) +

      //Add to the score if the offender has 1 previous offence depending on the time between the first offence and the current one
      (
        x.previousSanctions === 1 ?
          x.yearsCrim * lookupParameter(x.gender, 'OVP2SecondYears')(2, false) : 0
      ) +

      //A quadratic which uses the number of offence free months to add to the score
      (x.offFree * getRange('OVP2OffFree')(1, 1)) +
        (Math.pow(x.offFree, 2) * getRange('OVP2OffFree')(1, 2)) +

      //if the offender has no previous violent offences { add a constant to the score
      (
        x.previousSanctionsForViolentOffences === 0 ?
          lookupParameter(x.gender, 'OVP2ViolenceHistory')(2, false) : 0
      ) +

      //if the offender has 1 previous violent offence { add a constant to the score
      (
        x.previousSanctionsForViolentOffences === 1 ?
          lookupParameter(x.gender, 'OVP2ViolenceHistory')(3, false) : 0
      ) +

      //Multiply the number of violent offences by a factor and add to the score
      (x.previousSanctionsForViolentOffences * getRange('OVP2ViolentPreCons'))

      //Multiply the violent copas score by a factor and add to the score
      (
        x.previousSanctionsForViolentOffences > 0 ?
          x.VcopasScoreViolent * getRange('OVP2RateViolentPreCons') : 0
      ) +

      //if the offender lives with their partner add a constant
      //Also add the interaction between living with partner and relationship with partner
      (
        x.offenderUsuallyLivesWithParents === true ?
          getRange('OVP2OASys')(1, 2) + (x.currentRelationshipWithPartner * getRange('OVP2OASys')(5, 2)) : 0
      ) +

      //Add scores for the rest of the OASys questions
      (x.offenderIsLivingInSuitableAccomodation * getRange('OVP2OASys')(2, 2))

      (
        x.offenderIsUnemployedOrWillBeOnRelease === true ?
          2 * getRange('OVP2OASys')(3, 2) : 0
      ) +

      (x.currentRelationshipWithPartner * getRange('OVP2OASys')(4, 2)) +

      (
        x.evidenceOfDomesticViolencePartnerAbuse === true ?
          getRange('OVP2OASys')(6, 2) : 0
      ) +

      (x.regularActivitiexEncourageOffending * getRange('OVP2OASys')(7, 2)) +
      (x.offenderHasMotivationToTackleDrugMisuse * getRange('OVP2OASys')(8, 2)) +
      (x.offenderHasAlchoholProblem * getRange('OVP2OASys')(9, 2)) +
      (x.offenderHasEvidenceOfBingeDrinkingOrExcessiveAlchohol * getRange('OVP2OASys')(10, 2)) +
      (x.offenderHasImpulsivityProblem * getRange('OVP2OASys')(11, 2)) +
      (x.offenderHasTemperControlProblem * getRange('OVP2OASys')(12, 2)) +
      (x.offenderHasProCriminalAttitudes * getRange('OVP2OASys')(13, 2)) +

      //Add a score depending on what drugs the offender uses
      lookupParameter(x.mostOftenUsedDrug, 'OVP2Drugs');
  },

  getOVP2(x) {
    if (x.offenderHasHadAnOffenderInterviewOrOASys) {
      x.OVP2StaticScore = OVP2.getOVP2StaticScore(x);

      //Create new variables which hold the 1 and 2 year reoffending scores
      let Scores = [
        x.OVP2StaticScore + getRange('OVP2Intercept')(1, 1),
        x.OVP2StaticScore + getRange('OVP2Intercept')(1, 2)
      ];

      //if the number of previous sanctions is 2 or more { multiply the copas score by a factor and add to the score
      if (x.previousSanctions > 1) {
        Scores = Scores.map(n => n + x.VcopasScoreGen * lookupParameter(x.gender, 'OVP2ThirdOGRS4V'));
      }

      x.OVP2Score = Scores.map(logit);
    }

    return x;
  },
};

let IndecentImages = {
  getFemaleIndecentImages(x) {
    x.IndecentImagesScore = [
      getRange('IndecentImagesParams')(1, 1),
      getRange('IndecentImagesParams')(1, 2)
    ];

    return x;
  },

  getMaleNoHistoryIndecentImageOffences(x) {
    x.IndecentImagesScore = [
      getRange('IndecentImagesParams')(2, 1),
      getRange('IndecentImagesParams')(2, 2)
    ];

    return x;
  },

  getMaleMultipleIndecentImageOffences(x) {
    x.IndecentImagesScore = [
      getRange('IndecentImagesParams')(3, 1),
      getRange('IndecentImagesParams')(3, 2)
    ];

    return x;
  },

  getMaleSingleIndecentImageOffences(x) {
    x.IndecentImagesScore = [
      getRange('IndecentImagesParams')(4, 1),
      getRange('IndecentImagesParams')(4, 2)
    ];

    return x;
  },

  getMaleMultipleContctChildOffences(x) {
    x.IndecentImagesScore = [
      getRange('IndecentImagesParams')(5, 1),
      getRange('IndecentImagesParams')(5, 2)
    ];

    return x;
  },

  getMaleSingleContctChildOffences(x) {
    x.IndecentImagesScore = [
      getRange('IndecentImagesParams')(6, 1),
      getRange('IndecentImagesParams')(6, 2)
    ];

    return x;
  },

  getMaleContactAdultOrParaphiliaOffences(x) {
    x.IndecentImagesScore = [
      getRange('IndecentImagesParams')(7, 1),
      getRange('IndecentImagesParams')(7, 2)
    ];

    return x;
  },

  calculateIndecentImageProbability(x) {
    //Female offenders
    if (x.offenderIsFemale) {
      return IndecentImages.getFemaleIndecentImages(x);
    }

    //Male offenders
    //No sexual offending history
    if (!x.offenderHasSexualOffenceHistory) {
      return IndecentImages.getMaleNoHistoryIndecentImageOffences(x);
    }

    //Multi indecent images offences
    if (x.indecentImage > 1) {
      return IndecentImages.getMaleMultipleIndecentImageOffences(x);
    }

    //Single indecent image offence
    if (x.indecentImage === 1) {
      return IndecentImages.getMaleSingleIndecentImageOffences(x);
    }

    //Multi contact child offences
    if (x.contactChild > 1) {
      return IndecentImages.getMaleMultipleContctChildOffences(x);
    }

    //Single contact child offences
    if (x.contactChild === 1) {
      return IndecentImages.getMaleSingleContctChildOffences(x);
    }

    //Any other sexual offences
    if (x.contactAdult +
          x.paraphilia > 0) {
      return IndecentImages.getMaleContactAdultOrParaphiliaOffences(x);
    }

    return Object.assign(x, {
      IndecentImagesScore: [0 ,0]
    });
  }
};

let FemaleSex = {
  getFemaleSex(x) {
    if (x.offenderIsFemale && x.offenderHasSexualOffenceHistory) {
      x.FemaleSexScore = [
        getRange('FemaleSexRate'),
        getRange('FemaleSexRate')
      ];
    }

    return x;
  }
};

let MaleSex = {
  getMaleSex(x) {
    if (x.offenderIsMale && x.offenderHasSexualOffenceHistory) {
      x.MaleSexScore = [
        getRange('MaleSexIntercept')(1, 1) + x.OSPStaticScore * getRange('MaleSexOSP'),
        getRange('MaleSexIntercept')(1, 2) + x.OSPStaticScore * getRange('MaleSexOSP')
      ]
      .map(logit);
    }

    return x;
  },
};


// never used ???
let NonSex = {
  getNonSex(x) {
    //Offender only gets a score if they have no history of sexual offending (includes current)
    if (x.offenderHasSexualOffenceHistory) {
      x.NonSexScore = [0, 0];

      return x;
    }

    let Scores = [
      getRange('NonSexIntercept')(1, 1),
      getRange('NonSexIntercept')(1, 2)
    ]
    .map(n => n + Math.round(x.OGRS4VScore[1], 2) * getRange('NonSexParams')(1, 1) * 100);

    //if the offender is also male then they adjust score accordingly
    if (x.offenderIsMale) {
      Scores = Scores.map(n => n +
                 getRange('NonSexParams')(1, 2) +
                 (Math.round(x.OGRS4VScore[1], 2) * getRange('NonSexParams')(1, 3) * 100));
    }

    x.NonSexScore = Scores.map(logit);

    return x;
  },
};

let SVStatic = {
  getSVStatic(x) {
    if (x.offenderHasHadAnOffenderInterviewOrOASys) {
      return x;
    }

    let Score = 0 +
      //A quartic equation which uses the offenders age at the Date of discharge/sentencing of a community order
      (x.ageIndex * lookupParameter(x.gender, 'SVStaticAgeIndex')) +
        (Math.pow(x.ageIndex, 2) * lookupParameter(x.gender, 'SVStaticAgeIndex')) +
          (Math.pow(x.ageIndex, 3) * lookupParameter(x.gender, 'SVStaticAgeIndex')) +
            (Math.pow(x.ageIndex, 4) * lookupParameter(x.gender, 'SVStaticAgeIndex')) +

      //Add a constant depending on the offenders gender
      lookupParameter(x.gender, 'SVStaticSex') +

      //Add a constant depending on the current offence type
      lookupParameter(x.typeOfCurrentOffence, 'SVStaticOffenceType') +

      //Add a constant depending on whether the offender has previous sanctions
      lookupParameter(x.previousSanctions, 'SVStaticSanctions') +

      //Add 1 to include the current offence
      //Add to the score depending on how many sanctions the offender has
      //Cap the previous convictions at 50
      (Math.min(x.previousSanctions, 50) + 1) * getRange('SVStaticSanctionFactor') +

      //Add to the score if the offender has 1 previous offence depending on the time between the first offence and the current one
      (
        previousSanctions === 1 ?
          x.yearsCrim * lookupParameter(x.gender, 'SVStaticSecondYears') : 0
      ) +

      //A quartic equation which uses the number of offence free months
      (x.offFree * getRange('SVStaticOffFree')(1, 1)) +
        (Math.pow(x.offFree, 2) * getRange('SVStaticOffFree')(1, 2)) +
          (Math.pow(x.offFree, 3) * getRange('SVStaticOffFree')(1, 3)) +
            (Math.pow(x.offFree, 4) * getRange('SVStaticOffFree')(1, 4)) +

      //if the offender has 2 or more previous offences { use the rate of offending
      (
        x.previousSanctions > 1 ?
          x.VcopasScoreGen * lookupParameter(x.gender, 'SVStaticThirdOGRS4V') : 0
      ) +

      //if the offender has no previous violent offences { add a constant to the score
      (
        x.previousSanctionsForViolentOffences === 0 ?
          lookupParameter(x.gender, 'SVStaticViolenceHistory') : 0
      ) +

      //if the offender has one previous violent offences { add a constant to the score
      (
        x.previousSanctionsForViolentOffences === 1 ?
          lookupParameter(x.gender, 'SVStaticViolenceHistory') : 0
      ) +

      //Add a constant depending on the the number of previous violent offences
      (x.previousSanctionsForViolentOffences * getRange('SVStaticViolentPreCons')) +

      //Add a constant depending on the rate of violent offences
      (
        x.previousSanctionsForViolentOffences > 0 ?
          x.VcopasScoreViolent * getRange('SVStaticRateViolentPreCons') : 0
      ) +

      //if the current offence is VATP { add a constant depending on what category it is
      (
        x.typeOfCurrentOffence === 'Violence against the person' ?
          lookupParameter(x.categoryOfViolenceOffence, 'SVStaticViolence') : 0
      );

    x.SVStaticScore = [
      Score + getRange('SVStaticIntercept')(1, 1),
      Score + getRange('SVStaticIntercept')(1, 2)
    ]
    .map(logit);

    return x;
  }
};

let SVDynamic = {
  getSVDynamic(x) {
    if (x.offenderHasHadAnOffenderInterviewOrOASys) {
      let Score = 0 +
        //A quartic equation which uses the offenders age at the Date of discharge/sentencing of a community order
        (x.ageIndex * lookupParameter(x.gender, 'SVDynamicAgeIndex')) +
          (Math.pow(x.ageIndex, 2) * lookupParameter(x.gender, 'SVDynamicAgeIndex')) +
            (Math.pow(x.ageIndex, 3) * lookupParameter(x.gender, 'SVDynamicAgeIndex')) +
              (Math.pow(x.ageIndex, 4) * lookupParameter(x.gender, 'SVDynamicAgeIndex')) +

        //Add a constant depending on the offenders gender
        lookupParameter(x.gender, 'SVDynamicSex') +

        //Add a constant depending on the current offence type
        lookupParameter(x.typeOfCurrentOffence, 'SVDynamicOffenceType') +

        //Add a constant depending on whether the offender has previous sanctions
        lookupParameter(x.previousSanctions, 'SVDynamicSanctions') +

        //Add 1 to include the current offence
        //Cap the previous convictions at 50
        ((Math.min(x.previousSanctions, 50) + 1) * getRange('SVDynamicSanctionFactor')) +

        //Add to the score if the offender has 1 previous offence depending on the time between the first offence and the current one
        (
          x.previousSanctions === 1 ?
            x.yearsCrim * lookupParameter(x.gender, 'SVDynamicSecondYears') : 0
        ) +

        //A quartic equation which uses the number of offence free months
        (x.offFree * getRange('SVDynamicOffFree')(1, 1)) +
          (Math.pow(x.offFree, 2) * getRange('SVDynamicOffFree')(1, 2)) +
            (Math.pow(x.offFree, 3) * getRange('SVDynamicOffFree')(1, 3)) +
              (Math.pow(x.offFree, 4) * getRange('SVDynamicOffFree')(1, 4)) +

        //if the offender has 2 or more previous offences { use the rate of offending
        (
          x.previousSanctions > 1 ?
            x.VcopasScoreGen * lookupParameter(x.gender, 'SVDynamicThirdOGRS4V') : 0
        ) +

        //if the offender has no previous violent offences { add a constant to the score
        (
          x.previousSanctionsForViolentOffences === 0 ?
            lookupParameter(x.gender, 'SVDynamicViolenceHistory') : 0
        ) +

        //if the offender has one previous violent offences { add a constant to the score
        (
          x.previousSanctionsForViolentOffences === 1 ?
            lookupParameter(x.gender, 'SVDynamicViolenceHistory') : 0
        ) +

        //Add a constant depending on the the number of previous violent offences
        (x.previousSanctionsForViolentOffences * getRange('SVDynamicViolentPreCons')) +

        //Add a constant depending on the rate of violent offences
        (
          x.previousSanctionsForViolentOffences > 0 ?
          x.VcopasScoreViolent * getRange('SVDynamicRateViolentPreCons') : 0
        ) +

        //if the current offence is VATP { add a constant depending on what category it is
        (
          x.typeOfCurrentOffence === 'Violence against the person' ?
          lookupParameter(x.categoryOfViolenceOffence, 'SVDynamicViolence') : 0
        ) +

        //Dynamic Section

        //Criminal History, add the relevant constant if the offender has previous convictions
        x.previousConvictionsForSpecificOffences
            .reduce((s, x, i) => s + (x ? getRange('SVDynamicCrimHistory')(i, 2) : 0), 0) +

        //Add values depending on the answers to OASys questions
        (
          x.currentOffenceInvolvedCarryingUseOfWeapon === true ?
          getRange('SVDynamicOASys')(1, 2) : 0
        ) +

        (x.offenderIsLivingInSuitableAccomodation * getRange('SVDynamicOASys')(2, 2)) +

        (
          x.offenderIsUnemployedOrWillBeOnRelease === true ?
          2 * getRange('SVDynamicOASys')(3, 2) : 0
        ) +

        (x.currentRelationshipWithPartner * getRange('SVDynamicOASys')(4, 2)) +

        (
          x.evidenceOfDomesticViolencePartnerAbuse === true ?
          getRange('SVDynamicOASys')(5, 2) : 0
        ) +

        (x.offenderHasAlchoholProblem * getRange('SVDynamicOASys')(6, 2)) +
        (x.offenderHasEvidenceOfBingeDrinkingOrExcessiveAlchohol * getRange('SVDynamicOASys')(7, 2)) +
        (x.offenderHasImpulsivityProblem * getRange('SVDynamicOASys')(8, 2)) +
        (x.offenderHasTemperControlProblem * getRange('SVDynamicOASys')(9, 2)) +
        (x.offenderHasProCriminalAttitudes * getRange('SVDynamicOASys')(10, 2));

      //Add the intercept
      x.SVDynamicScore = [
        Score + getRange('SVDynamicIntercept')(1, 1),
        Score + getRange('SVDynamicIntercept')(1, 2)
      ]
      .map(logit);
    }

    return x;
  },
};

let RSR = {
  getRSR(x) {
    x.RSRScore = [0, 1]
      .map(i => (x.offenderHasHadAnOffenderInterviewOrOASys ? x.SVDynamicScore[i] : x.SVStaticScore[i]) +
                (x.offenderIsMale ? x.MaleSexScore[i] : x.FemaleSexScore[i]) +
                 x.IndecentImagesScore[i]
      );

    return x;
  },
};

let Calculation = {
  Calculation(x) {
    x = StoreInputs.getCalculateOtherVariables(x);

    x = OSP.getOSP(x);
    //x = OGRS4G.getOGRS4G(x);
    //x = OGRS4V.getOGRS4V(x);
    //x = OGP2.getOGP2(x);
    //x = OVP2.getOVP2(x);

    // Indecent Image Probability
    x = IndecentImages.calculateIndecentImageProbability(x);

    // Offender Sexual Probability
    x = FemaleSex.getFemaleSex(x);
    x = MaleSex.getMaleSex(x);
    //x = NonSex.getNonSex(x);

    // Probability of Non Sexual Violence
    x = SVStatic.getSVStatic(x);
    x = SVDynamic.getSVDynamic(x);

    x = RSR.getRSR(x);
/*
    x.output = {};

    x = Output.addOSP(x);

    // female offenders
    if (x.offenderIsFemale) {
      x.output.OSPOutput = [0, 0];
      x.output.OSPOutputBand = 'Female sex offender';
      x.outputSexualOutput = 'Female sex offender';

    // male offenders with sexual offence history
    } else if (x.offenderHasSexualOffenceHistory) {
    x.output.OSPOutput = x.OSPScore.map(n => Math.round(n, 4));
    x.output.OSPOutputBand = lookupParameter(x.OSPStaticScore, 'OSPRisk');

    x.output.SexualOutput = Math.round(x.OSPScore[x.scores1Year = true ? 0 : 1] * 100, 2);

    // male offenders with no sexual offence history
    } else {
      x.output.OSPOutput = [0, 0];
      x.output.OSPOutputBand = 'No sexual offence history';
      x.output.SexualOutput = 'No sexual offence history';
    }

    x.output.OGRS4GOutput = x.OGRS4GScore.map(n => Math.round(n, 3));
    x.output.OGRS4GOutputBand = lookupParameter(x.OGRS4GScore[0], 'OGRS4GRisk');

    x.output.OGRS4VOutput = x.OGRS4VScore.map(n => Math.round(n, 3));
    x.output.OGRS4VOutputBand = lookupParameter(x.OGRS4VScore[0], 'OGRS4VRisk');

    if (x.offenderHasHadAnOffenderInterviewOrOASys) {
      x.output.OGP2Output = x.OGP2Score.map(n => Math.round(n, 5));
      x.output.OGP2OutputBand = lookupParameter(x.OGP2Score[0], 'OGP2Risk');
      x.output.OVP2Output = x.OVP2Score.map(n => Math.round(n, 3));
      x.output.OVP2OutputBand = lookupParameter(x.OVP2Score[0], 'OVP2Risk');
    } else {
        x.output.OGP2Output = [0, 0];
        x.output.OGP2OutputBand = 'No OASys';
        x.output.OVP2Output = [0, 0];
        x.output.OVP2OutputBand = 'No OASys';
    }

    //if OASys data is available the dynamic scores will be used
    if (x.SVDynamicScore[0] > 0) {
      x.output.RSRDynamicOutput = x.RSRScore;
      x.output.RSRDynamicOutputBand = lookupParameter(x.RSRScore[0], 'RSRRisk');
      x.output.RSRStaticOutput = ['-', '-'];
      x.output.RSRStaticOutputBand = '-';
      x.output.SeriousPredictor = 'RSR Dynamic';
    } else {
      x.output.RSRDynamicOutput = ['No OASys', 'No OASys'];
      x.output.RSRDynamicOutputBand = 'No OASys';
      x.output.RSRStaticOutput = x.RSRScore;
      x.output.RSRStaticOutputBand = lookupParameter(x.RSRScore[0], 'RSRRisk');
      x.output.SeriousPredictor = 'RSR Static';
    }

    x.output.RSRMainOutput = Math.round(x.RSRScore[1] * 100, 2);

    if (x.offenderHasHadAnOffenderInterviewOrOASys) {
      x.output.GeneralOutput = Math.round(x.OGP2Score[1] * 100, 0);
      x.output.GeneralPredictor = 'OGP2';
      x.output.ViolentOutput = Math.round(x.OVP2Score[1] * 100, 0);
      x.output.ViolentPredictor = 'OVP2';
    } else {
      x.output.GeneralOutput = Math.round(x.OGRS4GScore[1] * 100, 0);
      x.output.GeneralPredictor = 'OGRS4G';
      x.output.ViolentOutput = Math.round(x.OGRS4VScore[1] * 100, 0);
      x.output.ViolentPredictor = 'OGRS4V';
    }
*/
    return x;
  }
};

//Offender Details
let x = {};

x.name = '';
x.dateOfBirth = new Date();
x.gender = '';
x.pncId = '';
x.deliusId = '';
x.dateOfAssessment = '';

//Current Offence
x.typeOfCurrentOffence = '';
x.dateOfSentenceOrDischarge = new Date();
x.dateOfCurrentConviction = new Date();
x.currentOffenceHasSexualElement = false;
x.hasStrangerVictim = false;
x.categoryOfViolenceOffence = '';

//Criminal History
x.dateOfFirstSanction = new Date();
x.previousSanctions = 0;
x.previousSanctionsForViolentOffences = 0;
x.offenderHasCriminalHistory = false;
x.dateOfMostRecentSexualOffence = new Date();
x.contactAdult = 0;
x.contactChild = 0;
x.indecentImage = 0;
x.paraphilia = 0;

//OASys/Interview
x.offenderHasHadAnOffenderInterviewOrOASys = false;
x.previousConvictionsForSpecificOffences = (new Array(9)).fill(false, 0);
x.currentOffenceInvolvedCarryingUseOfWeapon = false;
x.offenderUsuallyLivesWithParents = false;
x.offenderIsLivingInSuitableAccomodation = 0;
x.offenderIsUnemployedOrWillBeOnRelease = false;
x.currentRelationshipWithPartner = 0;
x.evidenceOfDomesticViolencePartnerAbuse = false;
x.regularActivitiexEncourageOffending = 0;
x.mostOftenUsedDrug = '';
x.offenderUsesDrugDaily = false;
x.offenderHasMotivationToTackleDrugMisuse = 0;
x.offenderHasAlchoholProblem = 0;
x.offenderHasEvidenceOfBingeDrinkingOrExcessiveAlchohol = 0;
x.offenderHasImpulsivityProblem = 0;
x.offenderHasTemperControlProblem = 0;
x.offenderHasProCriminalAttitudes = 0;

//Other variables
x.ageAtMostRecentSexualOffence = 0;
x.ageAtRiskDate = 0;
x.ageIndex = 0;
x.ageFirSanc = 0;
x.ageCurSanc = 0;
x.offFree = 0;
x.yearsCrim = 0;
x.copasScoreGen = '';
x.VcopasScoreGen = '';
x.VcopasScoreViolent = '';
x.careerStatus = '';
x.careerStatusViolent = '';

x.scores1Year = false;

Console.log(Calculation.getCalculation(x));
