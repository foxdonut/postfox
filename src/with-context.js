var _ = require("lodash");

var ctx = function() {
  var args = _.toArray(arguments);
  var paramProps = [];
  var fn = null;
  var resultProp = null;
  var foundFunction = false;
  var foundMultipleFunctions = false;
  var foundMultipleResultProps = false;

  for (var i = 0, t = args.length; i < t; i++) {
    var arg = args[i];

    if (_.isFunction(arg)) {
      if (foundFunction) {
        foundMultipleFunctions = true;
      }
      else {
        fn = arg;
        foundFunction = true;
      }
    }
    else if (foundFunction) {
      if (resultProp) {
        foundMultipleResultProps = true;
      }
      else {
        resultProp = arg;
      }
    }
    else {
      paramProps.push(arg);
    }
  }

  if (!foundFunction) {
    throw new Error("Expecting one function, but none provided.");
  }
  if (foundMultipleFunctions) {
    throw new Error("Expecting one function, but multiple provided.");
  }
  if (foundMultipleResultProps) {
    throw new Error("Expecting zero or one result property, but multiple provided.");
  }

  return function(context) {
    var params = _.isEmpty(paramProps) ? [context] :
      _.map(paramProps, function(prop) {
        return context[prop];
      });

    var result = null;

    var fnResult = fn.apply(null, params);

    if (resultProp) {
      var obj = {};
      obj[resultProp] = fnResult;
      result = _.extend(obj, context);
    }
    else {
      result = fnResult;
    }
    return result;
  };
};

module.exports = ctx;
