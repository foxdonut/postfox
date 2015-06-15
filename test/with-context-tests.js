var expect = require("chai").expect;

var _ = require("lodash");

var ctx = require("../src/with-context");

var context = {
  value: 32,
  a: 40,
  b: 2
};

var simpleFunction1 = function(x) {
  return x + 10;
};

var simpleFunction2 = function(x, y) {
  return x + y;
};

var contextFunction1 = function(contextParam) {
  return contextParam.value + 10;
};

describe("with-context", function() {
  describe("getting a property out of the context", function() {
    it("works with one property", function() {
      expect(ctx("value", simpleFunction1)(context)).to.equal(42);
    });

    it("works with multiple properties", function() {
      expect(ctx("a", "b", simpleFunction2)(context)).to.equal(42);
    });
  });
 
  describe("putting a property back into the context", function() {
    it("works with one property", function() {
      expect(ctx(contextFunction1, "result")(context).result).to.equal(42);
    });

    it("does not modify the original context", function() {
      ctx(contextFunction1, "result")(context);
      expect(context.result).to.not.exist;
    });
  });

  describe("both getting and putting properties from/into the context", function() {
    it("works with one property", function() {
      expect(ctx("value", simpleFunction1, "result")(context).result).to.equal(42);
    });

    it("works with multiple properties", function() {
      expect(ctx("a", "b", simpleFunction2, "result")(context).result).to.equal(42);
    });
  });

  describe("not passing the expected arguments", function() {
    it("throws an error if there is no function", function() {
      expect(_.partial(ctx, "a", "b")).to.throw(/one function/);
    });

    it("throws an error if there are multiple result properties", function() {
      expect(_.partial(ctx, contextFunction1, "result1", "result2")).to.throw(Error);
    });
  });
});

