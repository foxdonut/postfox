// Another attempt, where a function is always in an array, optionally grouped with its arg count
// when function.length does not return the desired value.
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
          return applyFunction(next[0], next[0].length, lst);
        }
      }
      return cons(next, lst);
    },
    []
  );
};

exports.run = run;
