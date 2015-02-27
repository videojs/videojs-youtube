/* jshint node: true */

exports.config = {
  seleniumAddress: 'http://localhost:4444/wd/hub',

  capabilities: {
    'browserName': 'chrome'
  },
  
  baseUrl: 'http://localhost:8080',

  specs: ['*_test.js'],

  framework: 'mocha',
  
  mochaOpts: {
    reporter: 'spec',
    slow: 3000
  }
};