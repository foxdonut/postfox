module.exports = function(grunt) {
  grunt.loadNpmTasks("grunt-mocha-test");

  grunt.initConfig({
    mochaTest: {
      test: {
        options: {
          reporter:"spec"
        },
        src: ["test/**/*-tests.js"]
      }
    }
  });

  grunt.registerTask("test", "mochaTest");
};
