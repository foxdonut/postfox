var _ = require("underscore");

var cons = function(el, lst) {
  lst.unshift(el);
  return lst;
};

var concatenative = function() {
  var args = _.toArray(arguments);
  return _.reduce(args,
    function(lst, next) {
      if (_.isFunction(next)) {
        var l = _.first(lst);
        var r = _.first(_.rest(lst));
        var rest = _.rest(_.rest(lst));
        return cons(next(r, l), rest);
      }
      else {
        return cons(next, lst);
      }
    },
    []
  );
};

var plus  = function(a,b) { return a + b; };
var minus = function(a,b) { return a - b; };
var times = function(a,b) { return a * b; };
var divide = function(a,b) { return a / b; };
var lengthOf = function(obj) { return obj.length; };
var equal = function(a,b) { return a == b; };
var equ = function(a,b) { return a === b; };

console.log("concatenative");
console.log( concatenative(5, 1, 2, plus, 4, times, plus, 3, minus) );
console.log("--");

// Every time there is a function, the value before is expected to be the number
// of values to take from the stack and pass to the function.
var concatenative2 = function() {
  return _.reduce(_.toArray(arguments),
    function(lst, next) {
      if (_.isFunction(next)) {
        var argCount = _.first(lst);
        var args = _.rest(lst);
        var fnArgs = _(args).first(argCount).reverse();
        var rest = _(args).rest(argCount);

        return cons(next.apply(null, fnArgs), rest);
      }
      else {
        return cons(next, lst);
      }
    },
    []
  );
};
console.log("concatenative2");
console.log( concatenative2(5, 1, 2, 2, plus, 4, 2, times, 2, plus, 3, 2, minus) );
console.log("--");

var applyFunction = function(fn, argCount, lst) {
  var fnArgs = _(lst).first(argCount).reverse();
  var rest = _(lst).rest(argCount);

  return cons(fn.apply(null, fnArgs), rest);
};

// Another attempt, where a function is always in an array, optionally grouped with its arg count
// when function.length does not return the desired value.
var postfix = function() {
  return _.reduce(_.toArray(arguments),
    function(lst, next) {
      if (_.isArray(next)) {
        if (next.length == 2 && _.isNumber(next[0]) && _.isFunction(next[1])) {
          return applyFunction(next[1], next[0], lst);
        }
        else if (next.length == 1 && _.isFunction(next[0])) {
          return applyFunction(next[0], next[0].length, lst);
        }
      }
      return cons(next, lst);
    },
    []
  );
};
console.log("postfix");
console.log( postfix(5, 1, 2, [plus], 4, [times], [plus], 3, [minus]) );
console.log( postfix([1, 2, 3, 4, 5], plus, 0, [3, _.reduce]) );
console.log("--");

// Yet another attempt, where a function value on the stack is called with
// function.length, a function in an array is passed on as an argument, and a
// function grouped with its arg count is called.
var postfix2 = function() {
  return _.reduce(_.toArray(arguments),
    function(lst, next) {
      if (_.isArray(next)) {
        if (next.length == 2 && _.isNumber(next[0]) && _.isFunction(next[1])) {
          return applyFunction(next[1], next[0], lst);
        }
        else if (next.length == 1 && _.isFunction(next[0])) {
          return cons(next[0], lst);
        }
      }
      else if (_.isFunction(next)) {
        return applyFunction(next, next.length, lst);
      }
      return cons(next, lst);
    },
    []
  );
};
console.log("postfix2");
console.log( postfix2(5, 1, 2, plus, 4, times, plus, 3, minus) );
console.log( postfix2([1, 2, 3, 4, 5], [plus], 0, [3, _.reduce]) );
console.log("--");

// This time, a helper function is used to establish the number of parameters to
// a function. Also experimenting with partial application.

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

var arity = function(argCount, originalFn) {
  var fn = function() {
    return originalFn.apply(null, _.toArray(arguments));
  };
  fn.argCount = argCount;
  return fn;
};

var postfix3 = function() {
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
  );
};
console.log("postfix3");
console.log( postfix3(5, 1, 2, plus, 4, times, plus, 3, minus) );
console.log( postfix3([1, 2, 3, 4, 5], quot(plus), 0, arity(3, _.reduce)) );
console.log( postfix3([1, 2, 3, 4, 5], quot(10, times), arity(2, _.map)) );
console.log( postfix3([1, 2, 3, 4, 5], quot(3, plus, 4, times), arity(2, _.map)) );
console.log("--");

exports.plus = plus;
exports.minus = minus;
exports.times = times;
exports.divide = divide;
exports.lengthOf = lengthOf;
exports.equal = equal;
exports.equ = equ;

exports.postfix = postfix;
exports.postfix2 = postfix2;
exports.postfix3 = postfix3;

