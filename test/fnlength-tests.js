var assert = require("assert");
var _ = require("underscore");

var fnlength = require("../src/fnlength");
var postfox = require("../src/postfox");

var plus = postfox.plus;
var minus = postfox.minus;
var times = postfox.times;

describe("fnlength", function() {
  it("uses function length", function() {
    assert.equal(14, fnlength.run(5, 1, 2, plus, 4, times, plus, 3, minus));
  });
  it("uses quotations and function arity in array", function() {
    assert.equal(15, fnlength.run([1, 2, 3, 4, 5], [plus], 0, [3, _.reduce]));
  });
});
