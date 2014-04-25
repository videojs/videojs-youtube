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
	}
  });
  
  grunt.loadNpmTasks('grunt-contrib-uglify');
  
  grunt.registerTask('default', ['uglify']);
};