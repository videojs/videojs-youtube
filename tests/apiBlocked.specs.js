// When the YouTube IFrame API script is blocked (an ad blocker, a privacy extension or a network
// filter), the player should report an error instead of throwing "YT is not defined" or waiting
// forever. Each test loads Video.js and the tech in a fresh frame and swaps the API script's URL.
describe('YouTube API blocked', function() {
  var frame;

  function loadPlayer(apiReplacement, done, check) {
    frame = document.createElement('iframe');
    document.body.appendChild(frame);
    var win = frame.contentWindow;

    var desc = Object.getOwnPropertyDescriptor(win.HTMLScriptElement.prototype, 'src');
    Object.defineProperty(win.HTMLScriptElement.prototype, 'src', {
      set: function(v) {
        desc.set.call(this, String(v).indexOf('youtube.com/iframe_api') !== -1 ? apiReplacement : v);
      },
      get: function() { return desc.get.call(this); }
    });

    var doc = win.document;
    doc.open();
    doc.write('<!doctype html><html><head>' +
      '<script>window.uncaught = [];' +
      'window.addEventListener("error", function(e) { uncaught.push(e.message); });<\/script>' +
      '</head><body>' +
      '<video id="v" class="video-js"></video>' +
      '<script src="/base/node_modules/video.js/dist/video.js"><\/script>' +
      '<script src="/base/src/Youtube.js"><\/script>' +
      '</body></html>');
    doc.close();

    win.addEventListener('load', function() {
      var player = win.videojs('v', {
        techOrder: ['youtube'],
        sources: [{ type: 'video/youtube', src: 'https://www.youtube.com/watch?v=aqz-KE-bpKQ' }]
      });
      // Give the tech a few ticks to start and find the API missing
      setTimeout(function() {
        check(player, win.uncaught);
        done();
      }, 500);
    });
  }

  afterEach(function() {
    if (frame) {
      document.body.removeChild(frame);
      frame = null;
    }
  });

  it('reports an error when the API script loads but does not define YT', function(done) {
    loadPlayer('data:text/javascript,', done, function(player, uncaught) {
      expect(uncaught).toEqual([]);
      expect(player.error()).not.toBeNull();
      expect(player.error().message).toContain('YouTube');
    });
  });

  it('reports an error when the API script fails to load', function(done) {
    loadPlayer('/base/this-file-does-not-exist.js', done, function(player, uncaught) {
      expect(uncaught).toEqual([]);
      expect(player.error()).not.toBeNull();
      expect(player.error().message).toContain('YouTube');
    });
  });

  it('reports the error for a player created after the API already failed', function(done) {
    loadPlayer('data:text/javascript,', function() {}, function(first) {
      var win = frame.contentWindow;
      var el = win.document.createElement('video');
      el.id = 'v2';
      win.document.body.appendChild(el);
      var second = win.videojs('v2', {
        techOrder: ['youtube'],
        sources: [{ type: 'video/youtube', src: 'https://www.youtube.com/watch?v=aqz-KE-bpKQ' }]
      });
      setTimeout(function() {
        expect(first.error()).not.toBeNull();
        expect(second.error()).not.toBeNull();
        done();
      }, 300);
    });
  });
});
