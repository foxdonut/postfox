var assert = require("assert");
var concatenative = require("../src/concatenative").concatenative;
var postfox = require("../src/postfox");

var plus = postfox.plus;
var minus = postfox.minus;
var times = postfox.times;

describe("concatenative", function() {
  it("should apply functions of two parameters", function() {
    assert.equal(14, concatenative(5, 1, 2, plus, 4, times, plus, 3, minus));
  });
});
