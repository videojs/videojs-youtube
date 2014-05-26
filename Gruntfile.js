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
  grunt.registerTask('test', ['connect:server', 'protractor:local']);
  grunt.registerTask('travis', ['connect:server', 'protractor:saucelabs']);
};