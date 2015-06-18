var expect = require("chai").expect;

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
    expect(postfox(5, 1, 2, plus, 4, times, plus, 3, minus)).to.equal(14);
  });

  it("uses quotations and function arity from helper", function() {
    expect(postfox([1, 2, 3, 4, 5], qtn(plus), 0, arity(3, _.reduce))).to.equal(15);
  });

  it("does partial function application in quotation", function() {
    expect(postfox([1, 2, 3, 4, 5], qtn(10, times), arity(2, _.map))).to.deep.equal([10, 20, 30, 40, 50]);
  });

  it("does multiple partial function application in quotation", function() {
    expect(postfox([1, 2, 3, 4, 5], qtn(3, plus, 4, times), arity(2, _.map))).to.deep.equal([16, 20, 24, 28, 32]);
  });

  it("allows postfox function definition", function() {
    var avg1 = function(x, y) {
      return (x + y) / 2;
    };

    var avg2 = postfunc(plus, 2, divide);
    var avg3 = postfunc(avg2, avg2);

    expect(postfox(80, 4, avg1)).to.equal(42);
    expect(postfox(80, 4, avg2)).to.equal(42);
    expect(postfox(2, 80, 4, avg2, plus, 10, avg2)).to.equal(27);
    expect(postfox(10, 60, 80, avg3)).to.equal(40);
  });

  it("provides utility functions", function() {
    expect(postfox(84, 2, divide)).to.equal(42);
    expect(postfox("hello", lengthOf)).to.equal(5);
    expect(postfox("8", 8, equal)).to.equal(true);
    expect(postfox("8", 8, equ)).to.equal(false);
    expect(postfox((4+4), 8, equ)).to.equal(true);
    expect(postfox(2, [4, 42], cons)).to.deep.equal([2, 4, 42]);
  });
});
