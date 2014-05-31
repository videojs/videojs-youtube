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
    protractor: {
      options: {
        keepAlive: false,
        noColor: false
      },
      local: {
        options: {
          configFile: 'test/local.config.js'
        }
      },
      saucelabs: {
        options: {
          configFile: 'test/saucelabs.config.js',
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
  
  grunt.registerTask('default', ['uglify']);
  
  grunt.registerTask('test', function() {
    if (process.env.TRAVIS_PULL_REQUEST === 'false') {
      grunt.task.run(['connect:server', 'protractor:saucelabs']);
    } else if (process.env.TRAVIS) {
      // TODO: Run tests with PhantomJS for pull request (we don't have access to saucelabs)
    } else {
      grunt.task.run(['connect:server', 'protractor:local']);
    }
  });
};