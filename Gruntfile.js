/* jshint node: true */
module.exports = function(grunt) {

  grunt.initConfig({
    uglify: {
      vjsyoutube: {
        options: {
          mangle: false
        },
        files: {
          'dist/vjs.youtube.js': ['src/youtube.js']
        }
      }
    },
    mocha_phantomjs: {
      all: {
        options: {
          urls: ['http://localhost:8080/test/unit/runner.html']
        }
      }
    },
    protractor: {
      options: {
        keepAlive: false,
        noColor: false
      },
      local: {
        options: {
          configFile: 'test/functional/local.config.js'
        }
      },
      saucelabs: {
        options: {
          configFile: 'test/functional/saucelabs.config.js',
          args: {
            sauceUser: process.env.SAUCE_USERNAME,
            sauceKey: process.env.SAUCE_ACCESS_KEY
          }
        }
      }
    },
    connect: {
      server: {
        options: {
          hostname: 'localhost',
          port: 8080
        }
      }
    }
  });
  
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-protractor-runner');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-mocha-phantomjs');
  
  grunt.registerTask('default', ['uglify']);
  
  grunt.registerTask('test', function() {
    if (process.env.TRAVIS_PULL_REQUEST === 'false') {
      grunt.task.run(['connect:server', 'mocha_phantomjs', 'protractor:saucelabs']);
    } else if (process.env.TRAVIS) {
      grunt.task.run(['connect:server', 'mocha_phantomjs']);
    } else {
      grunt.task.run(['connect:server', 'mocha_phantomjs', 'protractor:local']);
    }
  });
};