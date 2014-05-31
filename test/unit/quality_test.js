describe('Quality option', function() {
  it('should be converted to YouTube format correctly', function() {
    videojs.Youtube.convertQualityName('144p').should.equal('tiny');
    videojs.Youtube.convertQualityName('240p').should.equal('small');
    videojs.Youtube.convertQualityName('360p').should.equal('medium');
    videojs.Youtube.convertQualityName('480p').should.equal('large');
    videojs.Youtube.convertQualityName('720p').should.equal('hd720');
    videojs.Youtube.convertQualityName('1080p').should.equal('hd1080');
  });
  
  it('should be converted back from YouTube format correctly', function() {
    videojs.Youtube.parseQualityName('tiny').should.equal('144p');
    videojs.Youtube.parseQualityName('small').should.equal('240p');
    videojs.Youtube.parseQualityName('medium').should.equal('360p');
    videojs.Youtube.parseQualityName('large').should.equal('480p');
    videojs.Youtube.parseQualityName('hd720').should.equal('720p');
    videojs.Youtube.parseQualityName('hd1080').should.equal('1080p');
  });
});