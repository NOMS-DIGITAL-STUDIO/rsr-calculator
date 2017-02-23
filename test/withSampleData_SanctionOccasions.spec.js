const fixtureGenerators = require('./helpers/fixtureGenerators');

const RSRCalc = require('../lib').calculateRisk;
const fixtures = require('./data/data.json');

const runTestWithData = fixtureGenerators.runTestWithData(RSRCalc);
const addListOfTests = fixtureGenerators.addListOfTests(RSRCalc);
const addFilteredListOfTests = fixtureGenerators.addFilteredListOfTests(RSRCalc);

describe("Risk Of Serious Recidivism Calculator", () => {
  describe("when testing the issue of sanctionoccasions > 50",
    () => addFilteredListOfTests(fixtures, ["37", "344", "348", "487", "678", "835", "854"]));
});
