(function() {

  if (! jasmineRequire) {
      throw "jasmine library does not exist in global namespace!";
  }

  jasmineRequire.enableFocusTagging = function(jasmine){
    var env = jasmine.getEnv();
    var focusedSuites = [];
    var focusedSpecs  = [];
    var insideFocusedSuite = false;

    var focusSpec = function(env, description, body) {
      var spec = env.it(description, body);
      focusedSpecs.push(spec.id);
      return spec;
    };

    var focusSuite = function(env, description, body) {
      if (insideFocusedSuite) {
        return env.describe(description, body);
      }

      insideFocusedSuite = true;
      var suite = env.describe(description, body);
      insideFocusedSuite = false
      focusedSuites.push(suite.id);
      return suite;
    };

    env.executeFiltered = function() {
      if (focusedSpecs.length) {
        env.execute(focusedSpecs);
      } else if (focusedSuites.length) {
        env.execute(focusedSuites);
      } else {
        env.execute();
      }
    };

    focusMethods = {
      describe: function(description, tagsOrSpecDefinitions, specDefinitions) {
        if (tagsOrSpecDefinitions instanceof Function) {
          return env.describe(description, tagsOrSpecDefinitions);
        } else {
          if (tagsOrSpecDefinitions.focus) {
            return focusSuite(env, description, specDefinitions)
          }
        }
      },

      it: function(desc, tagsOrFunc, func) {
        if (tagsOrFunc instanceof Function) {
          return env.it(desc, tagsOrFunc);
        } else {
          if (tagsOrFunc.focus) {
            return focusSpec(env, desc, func);
          }
        }
      },

      fdescribe: function(description, specDefinitions) {
        return focusSuite(env, description, specDefinitions);
      },

      fit: function(desc, func) {
        return focusSpec(env, desc, func);
      }
    };

    globals = [];

    if (typeof global !== "undefined" && global !== null) {
      globals.push(global);
    }

    if (typeof window !== "undefined" && window !== null) {
      globals.push(window);
    }

    for (methodName in focusMethods) {
      methodBody = focusMethods[methodName];
      for (_i = 0, _len = globals.length; _i < _len; _i++) {
        object = globals[_i];
        object[methodName] = methodBody;
      }
    }
  }

})();
