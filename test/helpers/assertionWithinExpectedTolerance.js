const Assertion = require('chai').Assertion;

const withinTolerance = (t) => (x, e) =>
  Math.abs(e - x) < (Math.pow(10, -(t || 2)) / 2);

const compare_single_value_with_correct_results = (v, expected, tolerance) => {
  var assertIsEqual = withinTolerance(tolerance);

  var result = false;
  for (var property in expected) {
     if (assertIsEqual(v, expected[property])) {
       result = true;
     }
   }
   return result;
}

function assertionWithinExpectedTolerance(expected, precision) {
  this.assert(
      compare_single_value_with_correct_results(this._obj, expected.correct_results, precision)
    , "expected #{this} to be comparible to #{exp} but got #{act}"
    , "expected #{this} to not be comparable to #{act}"
    , expected.correct_results
    , this._obj
  );
}

Assertion.addMethod('withinExpectedTolerance', assertionWithinExpectedTolerance);

module.exports = assertionWithinExpectedTolerance;
