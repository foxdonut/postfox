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

  var getParams = function(context, params) {
    return _.isEmpty(params) ? [context] : _.map(params, _.partial(_.get, context));
  };

  var getResultObject = function(fnResult, results, context) {
    return _.extend(_.set({}, results[0], fnResult), context);
  };

  var getResult = function(fnResult, results, context) {
    return _.isEmpty(results) ? fnResult : getResultObject(fnResult, results, context);
  };

  return function(context) {
    var params = getParams(context, gatheredArgs.params);
    return getResult(gatheredArgs.functions[0].apply(null, params), gatheredArgs.results, context);
  };
};

module.exports = ctx;

