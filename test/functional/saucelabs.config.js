exports.config = {
  sauceUser: process.env.SAUCE_USERNAME,
  sauceKey: process.env.SAUCE_ACCESS_KEY,
  
  multiCapabilities: [{
        name: 'FireFox on XP',
        browserName: 'firefox',
        version: '19',
        platform: 'XP',
        build: process.env.TRAVIS_BUILD_NUMBER,
        'tunnel-identifier': process.env.TRAVIS_JOB_NUMBER
    }, {
        name: 'Chrome on XP',
        browserName: 'chrome',
        platform: 'XP',
        build: process.env.TRAVIS_BUILD_NUMBER,
        'tunnel-identifier': process.env.TRAVIS_JOB_NUMBER
    }, {
        name: 'Chrome on Linux',
        browserName: 'chrome',
        platform: 'linux',
        build: process.env.TRAVIS_BUILD_NUMBER,
        'tunnel-identifier': process.env.TRAVIS_JOB_NUMBER
    }, {
        name: 'IE10 on Windows 8',
        browserName: 'internet explorer',
        platform: 'WIN8',
        version: '10',
        build: process.env.TRAVIS_BUILD_NUMBER,
        'tunnel-identifier': process.env.TRAVIS_JOB_NUMBER
    }, {
        name: 'IE9 on Visa',
        browserName: 'internet explorer',
        platform: 'VISTA',
        version: '9',
        build: process.env.TRAVIS_BUILD_NUMBER,
        'tunnel-identifier': process.env.TRAVIS_JOB_NUMBER
    }, {
        name: 'IE8 on XP',
        browserName: 'internet explorer',
        platform: 'XP',
        version: '8',
        build: process.env.TRAVIS_BUILD_NUMBER,
        'tunnel-identifier': process.env.TRAVIS_JOB_NUMBER
    }],
  
  baseUrl: 'http://localhost:8080',

  specs: ['*_test.js'],

  framework: 'mocha',
  
  mochaOpts: {
    reporter: 'spec',
    slow: 3000
  }
};