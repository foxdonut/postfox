var assert = require("assert");
var _ = require("underscore");

var postfox = require("../src/postfox");

var plus  = postfox.plus,
    minus = postfox.minus,
    times = postfox.times,
    arity = postfox.arity,
    quot  = postfox.quot;

describe("postfox", function() {
  it("uses function length", function() {
    assert.equal(14, postfox.run(5, 1, 2, plus, 4, times, plus, 3, minus));
  });
  it("uses quotations and function arity from helper", function() {
    assert.equal(15, postfox.run([1, 2, 3, 4, 5], quot(plus), 0, arity(3, _.reduce)));
  });
  it("does partial function application in quotation", function() {
    assert.deepEqual([10, 20, 30, 40, 50], postfox.run([1, 2, 3, 4, 5], quot(10, times), arity(2, _.map)));
  });
  it("does multiple partial function application in quotation", function() {
    assert.deepEqual([16, 20, 24, 28, 32], postfox.run([1, 2, 3, 4, 5], quot(3, plus, 4, times), arity(2, _.map)));
  });
});
