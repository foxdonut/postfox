var _ = require("underscore");
var cons = require("./postfox").cons;

exports.concatenative = function() {
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
