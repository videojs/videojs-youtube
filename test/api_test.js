var should = require('should'),
    url = require('url');

describe('Test basic API commands for YouTube tech', function() {
  it('should play and pause', function() {
    browser.driver.get(url.resolve(browser.baseUrl, '/sandbox/index.html'));

    browser.driver.executeScript('videojs("vid1").play()');
    browser.driver.sleep(2000);
    
    browser.driver.executeScript('return videojs("vid1").paused()').then(function(paused) {
      paused.should.be.false;
    });
    
    browser.driver.executeScript('videojs("vid1").pause();');
    browser.driver.sleep(2000);
    
    browser.driver.executeScript('return videojs("vid1").paused()').then(function(paused) {
      paused.should.be.true;
    });
  });
  
  it('should change the source with regular URL', function() {
    browser.driver.get(url.resolve(browser.baseUrl, '/sandbox/index.html'));
    
    browser.driver.executeScript('videojs("vid1").src("https://www.youtube.com/watch?v=y6Sxv-sUYtM");');
    browser.driver.sleep(2000);
    
    browser.driver.executeScript('return videojs("vid1").src()').then(function(src) {
      src.should.equal('https://www.youtube.com/watch?v=y6Sxv-sUYtM');
    });
  });
  
  it('should change the source with Youtu.be URL', function() {
    browser.driver.get(url.resolve(browser.baseUrl, '/sandbox/index.html'));
    
    browser.driver.executeScript('videojs("vid1").src("https://www.youtu.be/watch?v=y6Sxv-sUYtM");');
    browser.driver.sleep(2000);
    
    browser.driver.executeScript('return videojs("vid1").src()').then(function(src) {
      src.should.equal('https://www.youtu.be/watch?v=y6Sxv-sUYtM');
    });
  });
  
  it('should change the source with Embeded URL', function() {
    browser.driver.get(url.resolve(browser.baseUrl, '/sandbox/index.html'));
    
    browser.driver.executeScript('videojs("vid1").src("https://www.youtube.com/embed/y6Sxv-sUYtM");');
    browser.driver.sleep(2000);
    
    browser.driver.executeScript('return videojs("vid1").src()').then(function(src) {
      src.should.equal('https://www.youtube.com/embed/y6Sxv-sUYtM');
    });
  });
  
  it('should change the source with playlist URL', function() {
    browser.driver.get(url.resolve(browser.baseUrl, '/sandbox/index.html'));
    
    browser.driver.executeScript('videojs("vid1").src("http://www.youtube.com/watch?v=xjS6SftYQaQ&list=SPA60DCEB33156E51F");');
    browser.driver.sleep(2000);
    
    browser.driver.executeScript('return videojs("vid1").src()').then(function(src) {
      src.should.equal('http://www.youtube.com/watch?v=xjS6SftYQaQ&list=SPA60DCEB33156E51F');
    });
  });
  
  // YouTube doesn't let you seek at the exact time that you want
  /*it('should seek at a specific time', function() {
    browser.driver.get(url.resolve(browser.baseUrl, '/sandbox/index.html'));
    
    browser.driver.executeScript('videojs("vid1").currentTime(10);');
    browser.driver.sleep(2000);
    
    browser.driver.executeScript('return videojs("vid1").currentTime()').then(function(currentTime) {
      currentTime.should.equal(10);
    });
  });*/
  
  it('should know duration', function() {
    browser.driver.get(url.resolve(browser.baseUrl, '/sandbox/index.html'));
    
    browser.driver.executeScript('videojs("vid1").play()');
    browser.driver.sleep(2000);
    
    browser.driver.executeScript('return videojs("vid1").duration()').then(function(duration) {
      duration.should.equal(227);
    });
  });
  
  it('should set the volume, mute and unmute', function() {
    browser.driver.get(url.resolve(browser.baseUrl, '/sandbox/index.html'));

    browser.driver.executeScript('videojs("vid1").play();videojs("vid1").volume(0.5);');
    browser.driver.sleep(2000);
    
    browser.driver.executeScript('return videojs("vid1").volume()').then(function(volume) {
      volume.should.equal(0.5);
    });
    
    browser.driver.executeScript('return videojs("vid1").muted()').then(function(muted) {
      muted.should.be.false;
    });
    
    browser.driver.executeScript('videojs("vid1").play();videojs("vid1").muted(true);');
    browser.driver.sleep(2000);
    
    browser.driver.executeScript('return videojs("vid1").muted()').then(function(muted) {
      muted.should.be.true;
    });
    
    browser.driver.executeScript('videojs("vid1").play();videojs("vid1").muted(false);');
    browser.driver.sleep(2000);
    
    browser.driver.executeScript('return videojs("vid1").muted()').then(function(muted) {
      muted.should.be.false;
    });
  });
});