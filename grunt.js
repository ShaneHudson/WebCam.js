module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    lint: {
      all: ['lib/**/*.js']
    },
    meta: {
      banner: '/*! Webcam.js - ' +
        '<%= grunt.template.today("yyyy-mm-dd") %> */'
    },
    concat: {
      dist: {
        src: ['require.js','webcam.js','lib/*/*.js'],
        dest: 'dist/webcam.js'
      }
    },
    jshint: {
      options: {
        browser: true
      }
    },
    watch: {
      scripts: {
        files: '<config:lint.all>',
        tasks: 'lint'
      }
    }
  });


  // Default task.
  grunt.registerTask('default', 'lint concat');

};