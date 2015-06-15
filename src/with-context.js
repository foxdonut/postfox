var _ = require("lodash");

var determineTarget = function(arg, result) {
  return _.isFunction(arg) ? "functions" :
    (_.isEmpty(result.functions) ? "params" : "results");
};

var gatherArgs = function(args) {
  var result = {
    params: [],
    functions: [],
    results: []
  };

  for (var i = 0, t = args.length; i < t; i++) {
    var arg = args[i];
    result[determineTarget(arg, result)].push(arg);
  }

  return result;
};

var verifyIfNoFunction = function(gatheredArgs) {
  if (_.isEmpty(gatheredArgs.functions)) {
    throw new Error("Expecting one function, but none provided.");
  }
  return gatheredArgs;
};

var verifyIfMultipleFunctions = function(gatheredArgs) {
  if (gatheredArgs.functions.length > 1) {
    throw new Error("Expecting one function, but multiple provided.");
  }
  return gatheredArgs;
}

var verifyIfMultipleResultProps = function(gatheredArgs) {
  if (gatheredArgs.results.length > 1) {
    throw new Error("Expecting zero or one result property, but multiple provided.");
  }
  return gatheredArgs;
};

var ctx = function() {
  var args = _.toArray(arguments);
  var gatheredArgs = gatherArgs(args);

  _.flow(verifyIfNoFunction, verifyIfMultipleFunctions, verifyIfMultipleResultProps)(gatheredArgs);

  return function(context) {
    var params = _.isEmpty(gatheredArgs.params) ? [context] :
      _.map(gatheredArgs.params, function(prop) {
        return context[prop];
      });

    var result = null;

    var fnResult = gatheredArgs.functions[0].apply(null, params);

    if (!_.isEmpty(gatheredArgs.results)) {
      var obj = {};
      obj[gatheredArgs.results[0]] = fnResult;
      result = _.extend(obj, context);
    }
    else {
      result = fnResult;
    }
    return result;
  };
};

module.exports = ctx;

