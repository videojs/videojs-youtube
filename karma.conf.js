module.exports = function(config) {
  var configuration = {
    basePath: '',
    frameworks: ['jasmine'],
    files: [
      'node_modules/video.js/dist/video.js',
      'src/Youtube.js',
      'tests/**/*.specs.js'
    ],
    browsers: ['Chrome'],
    customLaunchers: {
        'ChromeTravisCI': {
            base: 'Chrome',
            flags: ['--no-sandbox']
        }
    }
  };

  if (process.env.TRAVIS) {
    configuration.browsers = ['ChromeTravisCI'];
  }

  config.set(configuration);
};
