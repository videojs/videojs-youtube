var Youtube = videojs.getTech('Youtube');

describe('parseUrl', function() {
  it('should read the correct video ID', function() {
    expect(Youtube.parseUrl('https://www.youtube.com/watch?v=OPf0YbXqDm0').videoId).toBe('OPf0YbXqDm0');
    expect(Youtube.parseUrl('https://www.youtube.com/embed/OPf0YbXqDm0').videoId).toBe('OPf0YbXqDm0');
    expect(Youtube.parseUrl('https://youtu.be/OPf0YbXqDm0').videoId).toBe('OPf0YbXqDm0');
  });

  it('should read the list in the URL', function() {
    var url = 'https://www.youtube.com/watch?v=RgKAFK5djSk&list=PL55713C70BA91BD6E';
    expect(Youtube.parseUrl(url).listId).toBe('PL55713C70BA91BD6E');
  });
});
