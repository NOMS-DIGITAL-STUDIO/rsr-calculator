const fixtureGenerators = require('./helpers/fixtureGenerators');

const RSRCalc = require('../lib').calculateRisk;
const fixtures = require('./data/data.json');

const runTestWithData = fixtureGenerators.runTestWithData(RSRCalc);
const addListOfTests = fixtureGenerators.addListOfTests(RSRCalc);
const addFilteredListOfTests = fixtureGenerators.addFilteredListOfTests(RSRCalc);

describe("Risk Of Serious Recidivism Calculator", () => {
  describe("when running a single test",
    () => addFilteredListOfTests(fixtures, ["999"]));
});
