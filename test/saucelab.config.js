exports.config = {
  sauceUser: process.env.SAUCE_USERNAME,
  sauceKey: process.env.SAUCE_ACCESS_KEY,

  capabilities: {
    'browserName': 'chrome',
    'tunnel-identifier': process.env.TRAVIS_JOB_NUMBER,
    'build': process.env.TRAVIS_BUILD_NUMBER,
    'name': 'Chrome'
  },
  
  baseUrl: 'http://localhost:8080',

  specs: ['*_test.js'],

  framework: 'mocha',
  
  mochaOpts: {
    reporter: 'spec',
    slow: 3000
  }
};