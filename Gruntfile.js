'use strict';

var ngrok = require('ngrok');

module.exports = function(grunt) {

  // Load grunt tasks
  require('load-grunt-tasks')(grunt);

  // Grunt configuration
  grunt.initConfig({
    htmlmin: {        
      dist: {                               // Target
        options: {                          // Target options
          removeComments: true,
          collapseWhitespace: true,
	  collapseBooleanAttributes: true,
	  removeAttributeQuotes: true,
	  removeRedundantAttributes: true,
	  removeEmptyAttributes: true,
	  removeOptionalTags: true,
	  minifyJS: true,
	  minifyCSS: true
        },
        files: {                            // Dictionary of files
          'dist/index.html': 'index.html',  // 'destination': 'source'
        }
      }
    },

    jshint: {
      all: ['js/perfmatters.js']
    },

    pagespeed: {
      options: {
        nokey: true,
        locale: "en_GB",
        threshold: 40
      },
      local: {
        options: {
          strategy: "desktop"
        }
      },
      mobile: {
        options: {
          strategy: "mobile"
        }
      }
    }
  });

  // Register customer task for ngrok
  grunt.registerTask('psi-ngrok', 'Run pagespeed with ngrok', function() {
    var done = this.async();
    var port = 8000;

    ngrok.connect(port, function(err, url) {
      if (err !== null) {
        grunt.fail.fatal(err);
        return done();
      }
      grunt.log.ok('Listenening on ' + url);
      grunt.config.set('pagespeed.options.url', url);
      grunt.task.run('pagespeed');
      done();
    });
  });

  // Register default tasks
  grunt.registerTask('default', ['psi-ngrok']);
  grunt.registerTask('travis', 'jshint');
};
