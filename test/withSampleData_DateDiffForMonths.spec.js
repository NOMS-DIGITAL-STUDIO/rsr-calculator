const fixtureGenerators = require('./helpers/fixtureGenerators');

const RSRCalc = require('../lib').calculateRisk;
const fixtures = require('./data/data.json');

const runTestWithData = fixtureGenerators.runTestWithData(RSRCalc);
const addListOfTests = fixtureGenerators.addListOfTests(RSRCalc);
const addFilteredListOfTests = fixtureGenerators.addFilteredListOfTests(RSRCalc);

describe("Risk Of Serious Recidivism Calculator", () => {
  describe("when testing the issue of DateDiff for months",
    () => addFilteredListOfTests(fixtures, ["37", "178", "211", "344", "348", "411", "481", "487", "601", "678", "740", "834", "835", "845", "847", "854", "933", "989"]));
});
