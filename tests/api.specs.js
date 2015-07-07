var Youtube = videojs.getComponent('Youtube');

describe('YouTube static methods', function() {
  it('should define isSupported', function() {
    expect(typeof Youtube.isSupported).toBe('function');
  });
});
