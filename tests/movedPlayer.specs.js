// #620: moving the player in the page reloads YouTube's iframe, which then stops sending
// state events. The tech should start a new YouTube player when the iframe reloads.
describe('player moved in the page', function() {
  var Youtube = videojs.getTech('Youtube');
  var realYT = window.YT;
  var created, destroyed, wrapper;

  beforeEach(function() {
    created = 0;
    destroyed = 0;
    // A stand-in for the IFrame API: like the real one, it swaps the element for an iframe
    window.YT = {
      PlayerState: { UNSTARTED: -1, ENDED: 0, PLAYING: 1, PAUSED: 2, BUFFERING: 3, CUED: 5 },
      Player: function(id) {
        created++;
        var div = document.getElementById(id);
        var iframe = document.createElement('iframe');
        iframe.id = id;
        div.parentNode.replaceChild(iframe, div);
        this.destroy = function() {
          destroyed++;
          iframe.parentNode.removeChild(iframe);
        };
      }
    };

    wrapper = document.createElement('div');
    var div = document.createElement('div');
    div.id = 'moved-player-tech';
    wrapper.appendChild(div);
    document.body.appendChild(wrapper);
  });

  afterEach(function() {
    window.YT = realYT;
    document.body.removeChild(wrapper);
  });

  function fakeTech() {
    var tech = Object.create(Youtube.prototype);
    tech.el_ = wrapper;
    tech.options_ = { techId: 'moved-player-tech', source: { src: 'https://www.youtube.com/watch?v=aqz-KE-bpKQ' } };
    tech.url = Youtube.parseUrl(tech.options_.source.src);
    tech.trigger = function() {};
    tech.initYTPlayer();
    return tech;
  }

  function iframe() {
    return document.getElementById('moved-player-tech');
  }

  it('keeps the player when YouTube first loads', function() {
    fakeTech();
    iframe().dispatchEvent(new Event('load'));

    expect(created).toBe(1);
    expect(destroyed).toBe(0);
  });

  it('starts a new YouTube player when the iframe reloads', function() {
    fakeTech();
    iframe().dispatchEvent(new Event('load'));
    iframe().dispatchEvent(new Event('load'));

    expect(destroyed).toBe(1);
    expect(created).toBe(2);
    expect(iframe().tagName).toBe('IFRAME');
  });

  it('watches the new iframe too', function() {
    fakeTech();
    iframe().dispatchEvent(new Event('load'));
    iframe().dispatchEvent(new Event('load'));
    iframe().dispatchEvent(new Event('load'));
    iframe().dispatchEvent(new Event('load'));

    expect(created).toBe(3);
  });
});
