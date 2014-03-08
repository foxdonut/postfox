var assert = require("assert");
var _ = require("underscore");

var inarray = require("../src/inarray");
var postfox = require("../src/postfox");

var plus = postfox.plus;
var minus = postfox.minus;
var times = postfox.times;

describe("inarray", function() {
  it("calls functions in arrays", function() {
    assert.equal(14, inarray.run(5, 1, 2, [plus], 4, [times], [plus], 3, [minus]));
  });
  it("uses function arity specified in array", function() {
    assert.equal(15, inarray.run([1, 2, 3, 4, 5], plus, 0, [3, _.reduce]));
  });
});
