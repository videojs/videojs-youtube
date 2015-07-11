var Youtube = videojs.getComponent('Youtube');

describe('parseUrl', function() {
  it('should read the correct video ID', function() {
    expect(Youtube.parseUrl('https://www.youtube.com/watch?v=OPf0YbXqDm0').videoId).toBe('OPf0YbXqDm0');
    expect(Youtube.parseUrl('https://www.youtube.com/embed/OPf0YbXqDm0').videoId).toBe('OPf0YbXqDm0');
    expect(Youtube.parseUrl('https://youtu.be/OPf0YbXqDm0').videoId).toBe('OPf0YbXqDm0');
  });
});
