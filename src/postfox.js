var _ = require("underscore");

var cons = function(el, lst) {
  lst.unshift(el);
  return lst;
};

var push = function(el, lst) {
  lst.push(el);
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
  var fnArgs = _(lst).last(argCount);
  var rest = _(lst).first(lst.length - argCount);
  return push(fn.apply(null, fnArgs), rest);
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
var qtn = function() {
  var incoming = _.toArray(arguments);

  var args = [];
  var fn = null;

  for (var i = 0, t = incoming.length; i < t; i++) {
    var next = incoming[i];

    if (_.isFunction(next)) {
      var nextFn = _.partial.apply(null, cons(next, args));
      fn = (fn) ? _.compose(nextFn, fn) : nextFn;
      args = [];
    }
    else {
      args.push(next);
    }
  }
  fn.qtn = true;
  return fn;
};

var postfunc = function() {
  var args = _.toArray(arguments);

  var fn = function() {
    return args;
  };
  fn.postfunc = true;
  return fn;
};

var postfoxStep = function(lst, next) {
  if (_.isFunction(next)) {
    if (next.qtn) {
      return push(next, lst);
    }
    else {
      if (next.postfunc) {
        return postfoxProcess.apply(null, lst.concat(next()));
      }
      else {
        var argCount = next.argCount || next.length;
        return applyFunction(next, argCount, lst);
      }
    }
  }
  else {
    return push(next, lst);
  }
};

var postfoxProcess = function() {
  return _.reduce(_.toArray(arguments), postfoxStep, []);
};

var postfox = function() {
  return postfoxProcess.apply(null, _.toArray(arguments))[0];
};

postfox.plus = plus;
postfox.minus = minus;
postfox.times = times;
postfox.divide = divide;
postfox.lengthOf = lengthOf;
postfox.equal = equal;
postfox.equ = equ;
postfox.arity = arity;
postfox.qtn = qtn;
postfox.postfunc = postfunc;

module.exports = postfox;

