const fixtureGenerators = require('./helpers/fixtureGenerators');

const RSRCalc = require('../lib').calculateRisk;
const fixtures = require('./data/data.json');

const runTestWithData = fixtureGenerators.runTestWithData(RSRCalc, 'riskOfSeriousRecidivism');
const addListOfTests = fixtureGenerators.addListOfTests(RSRCalc, 'riskOfSeriousRecidivism');
const addFilteredListOfTests = fixtureGenerators.addFilteredListOfTests(RSRCalc, 'riskOfSeriousRecidivism');

describe("Risk Of Serious Recidivism Calculator", () => {
  describe("when testing the sample data from the spreadsheet",
    () => addListOfTests(fixtures));
});
