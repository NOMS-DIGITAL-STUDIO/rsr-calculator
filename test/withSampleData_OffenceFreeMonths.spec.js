const fixtureGenerators = require('./helpers/fixtureGenerators');

const RSRCalc = require('../lib').calculateRisk;
const fixtures = require('./data/data.json');

const runTestWithData = fixtureGenerators.runTestWithData(RSRCalc);
const addListOfTests = fixtureGenerators.addListOfTests(RSRCalc);
const addFilteredListOfTests = fixtureGenerators.addFilteredListOfTests(RSRCalc);

describe("Risk Of Serious Recidivism Calculator", () => {
  describe("when testing the tests with offence_free_months issues <DateDiff>",
    () => addFilteredListOfTests(fixtures, ["31", "148", "150",  "207",  "382",  "434", "477", "649", "826", "951"]));
});
