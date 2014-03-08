var _ = require("underscore");

var cons = function(el, lst) {
  lst.unshift(el);
  return lst;
};

var plus  = function(a,b) { return a + b; };
var minus = function(a,b) { return a - b; };
var times = function(a,b) { return a * b; };
var divide = function(a,b) { return a / b; };
var lengthOf = function(obj) { return obj.length; };
var equal = function(a,b) { return a == b; };
var equ = function(a,b) { return a === b; };

var applyFunction = function(fn, argCount, lst) {
  var fnArgs = _(lst).first(argCount).reverse();
  var rest = _(lst).rest(argCount);

  return cons(fn.apply(null, fnArgs), rest);
};

// A helper function is used to establish the number of parameters to
// a function when its length does not return the desired value.
var arity = function(argCount, originalFn) {
  var fn = function() {
    return originalFn.apply(null, _.toArray(arguments));
  };
  fn.argCount = argCount;
  return fn;
};

// Indicates a quotation. Also experimenting with partial function application.
var quot = function() {
  var incoming = _.toArray(arguments);

  var args = [];
  var fn = null;

  for (var i = 0, t = incoming.length; i < t; i++) {
    var next = incoming[i];

    if (_.isFunction(next)) {
      var nextFn = _.partial.apply(null, cons(next, args));
      fn = (fn == null) ? nextFn : _.compose(nextFn, fn);
      args = [];
    }
    else {
      args.push(next);
    }
  }
  fn.quot = true;
  return fn;
};

var run = function() {
  return _.reduce(_.toArray(arguments),
    function(lst, next) {
      if (_.isFunction(next)) {
        if (next.quot) {
          return cons(next, lst);
        }
        else {
          var argCount = next.argCount || next.length;
          return applyFunction(next, argCount, lst);
        }
      }
      return cons(next, lst);
    },
    []
  )[0];
};

exports.plus = plus;
exports.minus = minus;
exports.times = times;
exports.divide = divide;
exports.lengthOf = lengthOf;
exports.equal = equal;
exports.equ = equ;

exports.cons = cons;
exports.applyFunction = applyFunction;
exports.arity = arity;
exports.quot = quot;

exports.run = run;

