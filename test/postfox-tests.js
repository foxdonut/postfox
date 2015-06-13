var assert = require("assert");
var _ = require("lodash");

var postfox = require("../src/postfox");

var plus = postfox.plus,
    minus = postfox.minus,
    times = postfox.times,
    divide = postfox.divide,
    lengthOf = postfox.lengthOf,
    equal = postfox.equal,
    equ = postfox.equ,
    cons = postfox.cons,
    arity = postfox.arity,
    qtn  = postfox.qtn,
    postfunc = postfox.postfunc;

describe("postfox", function() {
  it("uses function length", function() {
    assert.equal(14, postfox(5, 1, 2, plus, 4, times, plus, 3, minus));
  });

  it("uses quotations and function arity from helper", function() {
    assert.equal(15, postfox([1, 2, 3, 4, 5], qtn(plus), 0, arity(3, _.reduce)));
  });

  it("does partial function application in quotation", function() {
    assert.deepEqual([10, 20, 30, 40, 50], postfox([1, 2, 3, 4, 5], qtn(10, times), arity(2, _.map)));
  });

  it("does multiple partial function application in quotation", function() {
    assert.deepEqual([16, 20, 24, 28, 32], postfox([1, 2, 3, 4, 5], qtn(3, plus, 4, times), arity(2, _.map)));
  });

  it("allows postfox function definition", function() {
    var avg1 = function(x, y) {
      return (x + y) / 2;
    };

    var avg2 = postfunc(plus, 2, divide);
    var avg3 = postfunc(avg2, avg2);

    assert.equal(42, postfox(80, 4, avg1));
    assert.equal(42, postfox(80, 4, avg2));
    assert.equal(27, postfox(2, 80, 4, avg2, plus, 10, avg2));
    assert.equal(40, postfox(10, 60, 80, avg3));
  });

  it("provides utility functions", function() {
    assert.equal(42, postfox(84, 2, divide));
    assert.equal(5, postfox("hello", lengthOf));
    assert.equal(true, postfox("8", 8, equal));
    assert.equal(false, postfox("8", 8, equ));
    assert.equal(true, postfox((4+4), 8, equ));
    assert.deepEqual([2, 4, 42], postfox(2, [4, 42], cons));
  });
});
