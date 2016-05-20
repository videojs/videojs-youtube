/**
 * @file Youtube.js
 * Youtube Media Controller - Wrapper for HTML5 Media API
 */
import videojs from 'video.js';

const Component = videojs.getComponent('Component');
const Tech = videojs.getComponent('Tech');

/**
 * Youtube Media Controller - Wrapper for HTML5 Media API
 *
 * @param {Object=} options Object of option names and values
 * @param {Function=} ready Ready callback function
 * @extends Tech
 * @class Youtube
 */

class Youtube extends Tech {
  constructor (options, ready) {
    super(options, ready);

    this.setPoster(options.poster);
    this.setSrc(this.options_.source, true);
    // Set the vjs-youtube class to the player
    // Parent is not set yet so we have to wait a tick
    setTimeout(function () {
      this.el_.parentNode.className += ' vjs-youtube';

      if (_isOnMobile) {
        this.el_.parentNode.className += ' vjs-youtube-mobile';
      }

      if (Youtube.isApiReady) {
        this.initYTPlayer();
      } else {
        Youtube.apiReadyQueue.push(this);
      }
    }.bind(this));
  }

  dispose () {
    this.el_.parentNode.className = this.el_.parentNode.className
      .replace(' vjs-youtube', '')
      .replace(' vjs-youtube-mobile', '');
    super.dispose(this);
  }

  createEl () {

    let div = videojs.createEl('div', {
      id: this.options_.techId,
      style: 'width:100%;height:100%;top:0;left:0;position:absolute'
    });

    let divWrapper = videojs.createEl('div');
    divWrapper.appendChild(div);

    if (!_isOnMobile && !this.options_.ytControls) {
      let divBlocker = videojs.createEl('div', {
        className: 'vjs-iframe-blocker',
        style: 'position:absolute;top:0;left:0;width:100%;height:100%'
      });

      // In case the blocker is still there and we want to pause
      divBlocker.onclick = this.pause.bind(this);

      divWrapper.appendChild(divBlocker);
    }

    return divWrapper;

  }

  initYTPlayer () {
    let playerlets = {
      controls: 0,
      modestbranding: 1,
      rel: 0,
      showinfo: 0,
      loop: this.options_.loop ? 1 : 0
    };

    // Let the user set any YouTube parameter
    // https://developers.google.com/youtube/player_parameters?playerVersion=HTML5#Parameters
    // To use YouTube controls, you must use ytControls instead
    // To use the loop or autoplay, use the video.js settings

    if (typeof this.options_.autohide !== 'undefined') {
      playerlets.autohide = this.options_.autohide;
    }

    if (typeof this.options_['cc_load_policy'] !== 'undefined') {
      playerlets['cc_load_policy'] = this.options_['cc_load_policy'];
    }

    if (typeof this.options_.ytControls !== 'undefined') {
      playerlets.controls = this.options_.ytControls;
    }

    if (typeof this.options_.disablekb !== 'undefined') {
      playerlets.disablekb = this.options_.disablekb;
    }

    if (typeof this.options_.end !== 'undefined') {
      playerlets.end = this.options_.end;
    }

    if (typeof this.options_.color !== 'undefined') {
      playerlets.color = this.options_.color;
    }

    if (!playerlets.controls) {
      // Let video.js handle the fullscreen unless it is the YouTube native controls
      playerlets.fs = 0;
    } else if (typeof this.options_.fs !== 'undefined') {
      playerlets.fs = this.options_.fs;
    }

    if (typeof this.options_.end !== 'undefined') {
      playerlets.end = this.options_.end;
    }

    if (typeof this.options_.hl !== 'undefined') {
      playerlets.hl = this.options_.hl;
    } else if (typeof this.options_.language !== 'undefined') {
      // Set the YouTube player on the same language than video.js
      playerlets.hl = this.options_.language.substr(0, 2);
    }

    if (typeof this.options_['iv_load_policy'] !== 'undefined') {
      playerlets['iv_load_policy'] = this.options_['iv_load_policy'];
    }

    if (typeof this.options_.list !== 'undefined') {
      playerlets.list = this.options_.list;
    } else if (this.url && typeof this.url.listId !== 'undefined') {
      playerlets.list = this.url.listId;
    }

    if (typeof this.options_.listType !== 'undefined') {
      playerlets.listType = this.options_.listType;
    }

    if (typeof this.options_.modestbranding !== 'undefined') {
      playerlets.modestbranding = this.options_.modestbranding;
    }

    if (typeof this.options_.playlist !== 'undefined') {
      playerlets.playlist = this.options_.playlist;
    }

    if (typeof this.options_.playsinline !== 'undefined') {
      playerlets.playsinline = this.options_.playsinline;
    }

    if (typeof this.options_.rel !== 'undefined') {
      playerlets.rel = this.options_.rel;
    }

    if (typeof this.options_.showinfo !== 'undefined') {
      playerlets.showinfo = this.options_.showinfo;
    }

    if (typeof this.options_.start !== 'undefined') {
      playerlets.start = this.options_.start;
    }

    if (typeof this.options_.theme !== 'undefined') {
      playerlets.theme = this.options_.theme;
    }

    this.activeVideoId = this.url ? this.url.videoId : null;
    this.activeList = playerlets.list;

    this.ytPlayer = new YT.Player(this.options_.techId, {
      videoId: this.activeVideoId,
      playerlets: playerlets,
      events: {
        onReady: this.onPlayerReady.bind(this),
        onPlaybackQualityChange: this.onPlayerPlaybackQualityChange.bind(this),
        onStateChange: this.onPlayerStateChange.bind(this),
        onError: this.onPlayerError.bind(this)
      }
    });
  }

  onPlayerReady () {
    this.playerReady_ = true;
    this.triggerReady();

    if (this.playOnReady) {
      this.play();
    }
  }

  onPlayerPlaybackQualityChange () {

  }

  onPlayerStateChange (e) {
    const state = e.data;

    if (state === this.lastState || this.errorNumber) {
      return;
    }

    switch (state) {
      case -1:
        this.trigger('loadedmetadata');
        this.trigger('durationchange');
        break;

      case YT.PlayerState.ENDED:
        this.trigger('ended');
        break;

      case YT.PlayerState.PLAYING:
        this.trigger('timeupdate');
        this.trigger('durationchange');
        this.trigger('playing');
        this.trigger('play');

        if (this.isSeeking) {
          this.onSeeked();
        }
        break;

      case YT.PlayerState.PAUSED:
        this.trigger('canplay');
        if (this.isSeeking) {
          this.onSeeked();
        } else {
          this.trigger('pause');
        }
        break;

      case YT.PlayerState.BUFFERING:
        this.player_.trigger('timeupdate');
        this.player_.trigger('waiting');
        break;
    }

    this.lastState = state;
  }

  onPlayerError (e) {
    this.errorNumber = e.data;
    this.trigger('error');

    this.ytPlayer.stopVideo();
    this.ytPlayer.destroy();
    this.ytPlayer = null;
  }

  error () {
    switch (this.errorNumber) {
      case 5:
        return {code: 'Error while trying to play the video'};

      case 2:
      case 100:
      case 150:
        return {code: 'Unable to find the video'};
      case 101:
        return {code: 'Playback on other Websites has been disabled by the video owner.'};
    }

    return {code: 'YouTube unknown error (' + this.errorNumber + ')'};
  }

  src (src) {
    if (src) {
      this.setSrc({src: src});

      if (this.options_.autoplay && !_isOnMobile) {
        this.play();
      }
    }

    return this.source;
  }

  poster () {
    // You can't start programmaticlly a video with a mobile
    // through the iframe so we hide the poster and the play button (with CSS)
    if (_isOnMobile) {
      return null;
    }

    return this.poster_;
  }

  setPoster (poster) {
    this.poster_ = poster;
  }

  setSrc (source) {
    if (!source || !source.src) {
      return;
    }

    delete this.errorNumber;
    this.source = source;
    this.url = Youtube.parseUrl(source.src);

    if (!this.options_.poster) {
      if (this.url.videoId) {
        // Set the low resolution first
        this.poster_ = 'https://img.youtube.com/vi/' + this.url.videoId + '/0.jpg';

        // Check if their is a high res
        this.checkHighResPoster();
      }
    }

    if (this.options_.autoplay && !_isOnMobile) {
      if (this.isReady_) {
        this.play();
      } else {
        this.playOnReady = true;
      }
    }
  }

  play () {
    if (!this.url || !this.url.videoId) {
      return;
    }

    this.wasPausedBeforeSeek = false;

    if (this.isReady_) {
      if (this.url.listId) {
        if (this.activeList === this.url.listId) {
          this.ytPlayer.playVideo();
        } else {
          this.ytPlayer.loadPlaylist(this.url.listId);
          this.activeList = this.url.listId;
        }
      }

      if (this.activeVideoId === this.url.videoId) {
        this.ytPlayer.playVideo();
      } else {
        this.ytPlayer.loadVideoById(this.url.videoId);
        this.activeVideoId = this.url.videoId;
      }
    } else {
      this.trigger('waiting');
      this.playOnReady = true;
    }
  }

  pause () {
    if (this.ytPlayer) {
      this.ytPlayer.pauseVideo();
    }
  }

  paused () {
    return (this.ytPlayer) ?
      (this.lastState !== YT.PlayerState.PLAYING && this.lastState !== YT.PlayerState.BUFFERING)
      : true;
  }

  currentTime () {
    return this.ytPlayer ? this.ytPlayer.getCurrentTime() : 0;
  }

  setCurrentTime (seconds) {
    if (this.lastState === YT.PlayerState.PAUSED) {
      this.timeBeforeSeek = this.currentTime();
    }

    if (!this.isSeeking) {
      this.wasPausedBeforeSeek = this.paused();
    }

    this.ytPlayer.seekTo(seconds, true);
    this.trigger('timeupdate');
    this.trigger('seeking');
    this.isSeeking = true;

    // A seek event during pause does not return an event to trigger a seeked event,
    // so run an interval timer to look for the currentTime to change
    if (this.lastState === YT.PlayerState.PAUSED && this.timeBeforeSeek !== seconds) {
      this.clearInterval(this.checkSeekedInPauseInterval);
      this.checkSeekedInPauseInterval = this.setInterval(function () {
        if (this.lastState !== YT.PlayerState.PAUSED || !this.isSeeking) {
          // If something changed while we were waiting for the currentTime to change,
          //  clear the interval timer
          this.clearInterval(this.checkSeekedInPauseInterval);
        } else if (this.currentTime() !== this.timeBeforeSeek) {
          this.trigger('timeupdate');
          this.onSeeked();
        }
      }.bind(this), 250);
    }
  }

  onSeeked () {
    this.clearInterval(this.checkSeekedInPauseInterval);
    this.isSeeking = false;

    if (this.wasPausedBeforeSeek) {
      this.pause();
    }

    this.trigger('seeked');
  }

  playbackRate () {
    return this.ytPlayer ? this.ytPlayer.getPlaybackRate() : 1;
  }

  setPlaybackRate (suggestedRate) {
    if (!this.ytPlayer) {
      return;
    }

    this.ytPlayer.setPlaybackRate(suggestedRate);
    this.trigger('ratechange');
  }

  duration () {
    return this.ytPlayer ? this.ytPlayer.getDuration() : 0;
  }

  currentSrc () {
    return this.source;
  }

  ended () {
    return this.ytPlayer ? (this.lastState === YT.PlayerState.ENDED) : false;
  }

  volume () {
    return this.ytPlayer ? this.ytPlayer.getVolume() / 100.0 : 1;
  }

  setVolume (percentAsDecimal) {
    if (!this.ytPlayer) {
      return;
    }

    this.ytPlayer.setVolume(percentAsDecimal * 100.0);
    this.setTimeout(function () {
      this.trigger('volumechange');
    }, 50);

  }

  muted () {
    return this.ytPlayer ? this.ytPlayer.isMuted() : false;
  }

  setMuted (mute) {
    if (!this.ytPlayer) {
      return;
    }
    else {
      this.muted(true);
    }

    if (mute) {
      this.ytPlayer.mute();
    } else {
      this.ytPlayer.unMute();
    }
    this.setTimeout(function () {
      this.trigger('volumechange');
    }, 50);
  }

  buffered () {
    if (!this.ytPlayer || !this.ytPlayer.getVideoLoadedFraction) {
      return {
        length: 0,
        start: function () {
          throw new Error('This TimeRanges object is empty');
        },
        end: function () {
          throw new Error('This TimeRanges object is empty');
        }
      };
    }

    const end = this.ytPlayer.getVideoLoadedFraction() * this.ytPlayer.getDuration();

    return {
      length: this.ytPlayer.getDuration(),
      start: function () {
        return 0;
      },
      end: function () {
        return end;
      }
    };
  }

  // TODO: Can we really do something with this on YouTUbe?
  load () {
  }

  resetction () {
  }

  supportsFullScreen () {
    return true;
  }

  // Tries to get the highest resolution thumbnail available for the video
  checkHighResPoster () {
    const uri = 'https://img.youtube.com/vi/' + this.url.videoId + '/maxresdefault.jpg';

    try {
      let image = new Image();
      image.onload = function () {
        // Onload may still be called if YouTube returns the 120x90 error thumbnail
        if ('naturalHeight' in image) {
          if (image.naturalHeight <= 90 || image.naturalWidth <= 120) {
            return;
          }
        } else if (image.height <= 90 || image.width <= 120) {
          return;
        }

        this.poster_ = uri;
        this.trigger('posterchange');
      }.bind(this);
      image.onerror = function () {
      };
      image.src = uri;
    }
    catch (e) {
    }
  }
}

Youtube.prototype.options_ = {};

Youtube.apiReadyQueue = [];

/* Youtube Support Testing -------------------------------------------------------- */

Youtube.isSupported = function () {
  return true;
};

// Add Source Handler pattern functions to this tech
Tech.withSourceHandlers(Youtube);

/*
 * The default native source handler.
 * This simply passes the source to the video element. Nothing fancy.
 *
 * @param  {Object} source   The source object
 * @param  {Flash} tech  The instance of the Flash tech
 */
Youtube.nativeSourceHandler = {};

let _isOnMobile = /(iPad|iPhone|iPod|Android)/g.test(navigator.userAgent);

Youtube.parseUrl = function (url) {
  let result = {
    videoId: null
  };

  const regex = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  let match = url.match(regex);

  if (match && match[2].length === 11) {
    result.videoId = match[2];
  }

  const regPlaylist = /[?&]list=([^#\&\?]+)/;
  match = url.match(regPlaylist);

  if (match && match[1]) {
    result.listId = match[1];
  }

  return result;
};

const loadApi = function () {
  let tag = document.createElement('script');
  tag.src = 'https://www.youtube.com/iframe_api';
  let firstScriptTag = document.getElementsByTagName('script')[0];
  firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
};

const injectCss = function () {
  let css = // iframe blocker to catch mouse events
    '.vjs-youtube .vjs-iframe-blocker { display: none; }' +
    '.vjs-youtube.vjs-user-inactive .vjs-iframe-blocker { display: block; }' +
    '.vjs-youtube .vjs-poster { background-size: cover; }' +
    '.vjs-youtube-mobile .vjs-big-play-button { display: none; }';

  let head = document.head || document.getElementsByTagName('head')[0];

  let style = document.createElement('style');
  style.type = 'text/css';

  if (style.styleSheet) {
    style.styleSheet.cssText = css;
  } else {
    style.appendChild(document.createTextNode(css));
  }

  head.appendChild(style);
};

/**
 * Check if Flash can play the given videotype
 * @param  {String} type    The mimetype to check
 * @return {String}         'probably', 'maybe', or '' (empty string)
 */
Youtube.nativeSourceHandler.canPlayType = function (source) {
  return (source === 'video/youtube');
};

/*
 * Check Youtube can handle the source natively
 *
 * @param  {Object} source  The source object
 * @return {String}         'probably', 'maybe', or '' (empty string)
 */
Youtube.nativeSourceHandler.canHandleSource = function (source) {

  // If a type was provided we should rely on that
  if (source.type) {
    return Youtube.nativeSourceHandler.canPlayType(source.type);
  } else if (source.src) {
    return Youtube.nativeSourceHandler.canPlayType(source.src);
  }

  return '';
};

Youtube.nativeSourceHandler.handleSource = function (source, tech) {
  tech.src(source.src);
};

/*
 * Clean up the source handler when disposing the player or switching sources..
 * (no cleanup is needed when supporting the format natively)
 */
Youtube.nativeSourceHandler.dispose = function () {
};

// Register the native source handler
Youtube.registerSourceHandler(Youtube.nativeSourceHandler);

window.onYouTubeIframeAPIReady = function () {
  Youtube.isApiReady = true;

  for (let i = 0; i < Youtube.apiReadyQueue.length; ++i) {
    Youtube.apiReadyQueue[i].initYTPlayer();
  }
};

loadApi();
injectCss();

Component.registerComponent('Youtube', Youtube);

Tech.registerTech('Youtube', Youtube);


export default Youtube;
