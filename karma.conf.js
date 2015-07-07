module.exports = function(config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine'],
    files: [
      'node_modules/video.js/dist/video.js',
      'src/Youtube.js',
      'tests/**/*.specs.js'
    ],
    browsers: ['Chrome']
  });
};
