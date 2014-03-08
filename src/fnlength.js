// Yet another attempt, where a function value on the stack is called with
// function.length, a function in an array is passed on as an argument, and a
// function grouped with its arg count is called.

var _ = require("underscore");
var postfox = require("./postfox");
var cons = postfox.cons,
    applyFunction = postfox.applyFunction;

var run = function() {
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

exports.run = run;
