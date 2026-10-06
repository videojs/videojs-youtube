// #618: play() asked for while YouTube was still cueing the first video. Cueing finishes after
// it and leaves the player cued (state 5), so nothing plays and the spinner never goes away.
describe('play before the video is cued', function() {
  var Youtube = videojs.getTech('Youtube');
  var realYT = window.YT;

  beforeEach(function() {
    window.YT = { PlayerState: { UNSTARTED: -1, ENDED: 0, PLAYING: 1, PAUSED: 2, BUFFERING: 3, CUED: 5 } };
  });

  afterEach(function() {
    window.YT = realYT;
  });

  function fakeTech() {
    var tech = Object.create(Youtube.prototype);
    tech.trigger = jasmine.createSpy('trigger');
    tech.player_ = { trigger: function() {} };
    tech.ytPlayer = { playVideo: jasmine.createSpy('playVideo') };
    tech.url = { videoId: 'aqz-KE-bpKQ' };
    tech.activeVideoId = 'aqz-KE-bpKQ';
    tech.isReady_ = true;
    return tech;
  }

  it('asks YouTube to play again when cueing finishes after play()', function() {
    var tech = fakeTech();
    tech.play();
    expect(tech.ytPlayer.playVideo.calls.count()).toBe(1);

    // What YouTube reported in the browser: buffering, back to unstarted, then cued
    tech.onPlayerStateChange({ data: YT.PlayerState.BUFFERING });
    tech.onPlayerStateChange({ data: YT.PlayerState.UNSTARTED });
    tech.onPlayerStateChange({ data: YT.PlayerState.CUED });

    expect(tech.ytPlayer.playVideo.calls.count()).toBe(2);
  });

  it('asks only once, so it cannot loop', function() {
    var tech = fakeTech();
    tech.play();
    tech.onPlayerStateChange({ data: YT.PlayerState.CUED });
    tech.onPlayerStateChange({ data: YT.PlayerState.UNSTARTED });
    tech.onPlayerStateChange({ data: YT.PlayerState.CUED });

    expect(tech.ytPlayer.playVideo.calls.count()).toBe(2);
  });

  it('does not play a cued video nobody asked to play, and clears the spinner', function() {
    var tech = fakeTech();
    tech.onPlayerStateChange({ data: YT.PlayerState.CUED });

    expect(tech.ytPlayer.playVideo).not.toHaveBeenCalled();
    expect(tech.trigger).toHaveBeenCalledWith('canplay');
  });

  it('does not play after a pause', function() {
    var tech = fakeTech();
    tech.ytPlayer.pauseVideo = function() {};
    tech.play();
    tech.pause();
    tech.onPlayerStateChange({ data: YT.PlayerState.CUED });

    expect(tech.ytPlayer.playVideo.calls.count()).toBe(1);
  });
});
