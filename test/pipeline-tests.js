var expect = require("chai").expect;

var _ = require("lodash");
var fp = require("functional-pipeline");

var triple = function(x) {
  return 3 * x;
};
var add12 = function(x) {
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
      return add12(triple(obj.getAge()));
    };
    var result = pipeline(data);
    expect(result).to.equal(42);
  });

  it("works with lodash flow", function() {
    var getAgeFn = function(obj) { return obj.getAge(); };
    var pipeline = _.flow(getAgeFn, triple, add12);

    var result = pipeline(data);
    expect(result).to.equal(42);
  });

  it("works with functional-pipeline - method", function() {
    var pipeline = fp("getAge", triple, add12);

    var result = pipeline(data);
    expect(result).to.equal(42);
  });

  it("works with functional-pipeline - property", function() {
    var pipeline = fp("age", triple, add12);

    var result = pipeline(data);
    expect(result).to.equal(42);
  });
});

var ctx = function(extract, fn, reinsert) {
  return function(context) {
    context[reinsert] = fn(context[extract]);
    return context;
  };
};

var ctxR = function(fn, reinsert) {
  return function(context) {
    context[reinsert] = fn(context);
    return context;
  };
};

var context = {
  duck: "quack",
  value: 32
};

var simple = function(x) {
  return x + 10;
};

describe("context pipeline", function() {
  it("passes a context property to a simple function and puts the result back", function() {
    var pipeline = ctx("value", simple, "result");
    var output = pipeline(context);
    expect(output.value).to.equal(32);
    expect(output.result).to.equal(42);
  });

  it("works within a pipeline", function() {
    var innerPipeline = fp("value", triple, add12);
    var pipeline = ctxR(innerPipeline, "result");
    var output = pipeline(context);
    expect(output.result).to.equal(108);
  });

  it("would work with an intermediate step", function() {
    var pipeline = fp("value", triple, add12);
    var output = {result: pipeline(context)};
    expect(output.result).to.equal(108);
  });
});
