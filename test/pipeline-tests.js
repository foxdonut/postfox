var expect = require("chai").expect;

var _ = require("lodash");
var fp = require("functional-pipeline");

var triple = function(x) {
  return 3 * x;
};
var add2 = function(x) {
  return x + 12;
};
var data = {
  age: 10,
  getAge: function() {
    return this.age;
  }
};

describe("basic pipeline", function() {
  it("doesn't look good inside-out", function() {
    var pipeline = function(obj) {
      return add2(triple(obj.getAge()));
    };
    var result = pipeline(data);
    expect(result).to.equal(42);
  });

  it("works with lodash flow", function() {
    var getAge = function(obj) { return obj.getAge(); };
    var pipeline = _.flow(getAge, triple, add2);

    var result = pipeline(data);
    expect(result).to.equal(42);
  });
});

describe("context pipeline", function() {
  var ctx = function(extract, fn, reinsert) {
    return function(context) {
      context[reinsert] = fn(context[extract]);
      return context;
    };
  };

  it("passes a context property to a simple function and puts the result back", function() {
    var context = {
      duck: "quack",
      value: 32
    };

    var simple = function(x) {
      return x + 10;
    };

    var pipeline = ctx("value", simple, "result");
    context = pipeline(context);
    expect(context.value).to.equal(32);
    expect(context.result).to.equal(42);
  });
});
