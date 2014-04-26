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
    release: {
      file: 'package.json',
      commit:  true,
      npm: true,
      message: 'Release %version%',
      tagName: 'v<%= version %>'
    }
  });
  
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-release');
  
  grunt.registerTask('default', ['uglify']);
};