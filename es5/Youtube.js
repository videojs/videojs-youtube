/**
 * @file Youtube.js
 * Youtube Media Controller - Wrapper for HTML5 Media API
 */
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _videoJs = require('video.js');

var _videoJs2 = _interopRequireDefault(_videoJs);

var Component = _videoJs2['default'].getComponent('Component');
var Tech = _videoJs2['default'].getComponent('Tech');

/**
 * Youtube Media Controller - Wrapper for HTML5 Media API
 *
 * @param {Object=} options Object of option names and values
 * @param {Function=} ready Ready callback function
 * @extends Tech
 * @class Youtube
 */

var Youtube = (function (_Tech) {
  _inherits(Youtube, _Tech);

  function Youtube(options, ready) {
    _classCallCheck(this, Youtube);

    _get(Object.getPrototypeOf(Youtube.prototype), 'constructor', this).call(this, options, ready);

    this.setPoster(options.poster);
    this.setSrc(this.options_.source, true);
    // Set the vjs-youtube class to the player
    // Parent is not set yet so we have to wait a tick
    setTimeout((function () {
      this.el_.parentNode.className += ' vjs-youtube';

      if (_isOnMobile) {
        this.el_.parentNode.className += ' vjs-youtube-mobile';
      }

      if (Youtube.isApiReady) {
        this.initYTPlayer();
      } else {
        Youtube.apiReadyQueue.push(this);
      }
    }).bind(this));
  }

  _createClass(Youtube, [{
    key: 'dispose',
    value: function dispose() {
      this.el_.parentNode.className = this.el_.parentNode.className.replace(' vjs-youtube', '').replace(' vjs-youtube-mobile', '');
      _get(Object.getPrototypeOf(Youtube.prototype), 'dispose', this).call(this, this);
    }
  }, {
    key: 'createEl',
    value: function createEl() {

      var div = _videoJs2['default'].createEl('div', {
        id: this.options_.techId,
        style: 'width:100%;height:100%;top:0;left:0;position:absolute'
      });

      var divWrapper = _videoJs2['default'].createEl('div');
      divWrapper.appendChild(div);

      if (!_isOnMobile && !this.options_.ytControls) {
        var divBlocker = _videoJs2['default'].createEl('div', {
          className: 'vjs-iframe-blocker',
          style: 'position:absolute;top:0;left:0;width:100%;height:100%'
        });

        // In case the blocker is still there and we want to pause
        divBlocker.onclick = this.pause.bind(this);

        divWrapper.appendChild(divBlocker);
      }

      return divWrapper;
    }
  }, {
    key: 'initYTPlayer',
    value: function initYTPlayer() {
      var playerVars = {
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
        playerVars.autohide = this.options_.autohide;
      }

      if (typeof this.options_['cc_load_policy'] !== 'undefined') {
        playerVars['cc_load_policy'] = this.options_['cc_load_policy'];
      }

      if (typeof this.options_.ytControls !== 'undefined') {
        playerVars.controls = this.options_.ytControls;
      }

      if (typeof this.options_.disablekb !== 'undefined') {
        playerVars.disablekb = this.options_.disablekb;
      }

      if (typeof this.options_.end !== 'undefined') {
        playerVars.end = this.options_.end;
      }

      if (typeof this.options_.color !== 'undefined') {
        playerVars.color = this.options_.color;
      }

      if (!playerVars.controls) {
        // Let video.js handle the fullscreen unless it is the YouTube native controls
        playerVars.fs = 0;
      } else if (typeof this.options_.fs !== 'undefined') {
        playerVars.fs = this.options_.fs;
      }

      if (typeof this.options_.end !== 'undefined') {
        playerVars.end = this.options_.end;
      }

      if (typeof this.options_.hl !== 'undefined') {
        playerVars.hl = this.options_.hl;
      } else if (typeof this.options_.language !== 'undefined') {
        // Set the YouTube player on the same language than video.js
        playerVars.hl = this.options_.language.substr(0, 2);
      }

      if (typeof this.options_['iv_load_policy'] !== 'undefined') {
        playerVars['iv_load_policy'] = this.options_['iv_load_policy'];
      }

      if (typeof this.options_.list !== 'undefined') {
        playerVars.list = this.options_.list;
      } else if (this.url && typeof this.url.listId !== 'undefined') {
        playerVars.list = this.url.listId;
      }

      if (typeof this.options_.listType !== 'undefined') {
        playerVars.listType = this.options_.listType;
      }

      if (typeof this.options_.modestbranding !== 'undefined') {
        playerVars.modestbranding = this.options_.modestbranding;
      }

      if (typeof this.options_.playlist !== 'undefined') {
        playerVars.playlist = this.options_.playlist;
      }

      if (typeof this.options_.playsinline !== 'undefined') {
        playerVars.playsinline = this.options_.playsinline;
      }

      if (typeof this.options_.rel !== 'undefined') {
        playerVars.rel = this.options_.rel;
      }

      if (typeof this.options_.showinfo !== 'undefined') {
        playerVars.showinfo = this.options_.showinfo;
      }

      if (typeof this.options_.start !== 'undefined') {
        playerVars.start = this.options_.start;
      }

      if (typeof this.options_.theme !== 'undefined') {
        playerVars.theme = this.options_.theme;
      }

      this.activeVideoId = this.url ? this.url.videoId : null;
      this.activeList = playerVars.list;

      this.ytPlayer = new YT.Player(this.options_.techId, {
        videoId: this.activeVideoId,
        playerVars: playerVars,
        events: {
          onReady: this.onPlayerReady.bind(this),
          onPlaybackQualityChange: this.onPlayerPlaybackQualityChange.bind(this),
          onStateChange: this.onPlayerStateChange.bind(this),
          onError: this.onPlayerError.bind(this)
        }
      });
    }
  }, {
    key: 'onPlayerReady',
    value: function onPlayerReady() {
      this.playerReady_ = true;
      this.triggerReady();

      if (this.playOnReady) {
        this.play();
      }
    }
  }, {
    key: 'onPlayerPlaybackQualityChange',
    value: function onPlayerPlaybackQualityChange() {}
  }, {
    key: 'onPlayerStateChange',
    value: function onPlayerStateChange(e) {
      var state = e.data;

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
  }, {
    key: 'onPlayerError',
    value: function onPlayerError(e) {
      this.errorNumber = e.data;
      this.trigger('error');

      this.ytPlayer.stopVideo();
      this.ytPlayer.destroy();
      this.ytPlayer = null;
    }
  }, {
    key: 'error',
    value: function error() {
      switch (this.errorNumber) {
        case 5:
          return { code: 'Error while trying to play the video' };

        case 2:
        case 100:
        case 150:
          return { code: 'Unable to find the video' };
        case 101:
          return { code: 'Playback on other Websites has been disabled by the video owner.' };
      }

      return { code: 'YouTube unknown error (' + this.errorNumber + ')' };
    }
  }, {
    key: 'src',
    value: function src(_src) {
      if (_src) {
        this.setSrc({ src: _src });

        if (this.options_.autoplay && !_isOnMobile) {
          this.play();
        }
      }

      return this.source;
    }
  }, {
    key: 'poster',
    value: function poster() {
      // You can't start programmaticlly a video with a mobile
      // through the iframe so we hide the poster and the play button (with CSS)
      if (_isOnMobile) {
        return null;
      }

      return this.poster_;
    }
  }, {
    key: 'setPoster',
    value: function setPoster(poster) {
      this.poster_ = poster;
    }
  }, {
    key: 'setSrc',
    value: function setSrc(source) {
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
  }, {
    key: 'play',
    value: function play() {
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
  }, {
    key: 'pause',
    value: function pause() {
      if (this.ytPlayer) {
        this.ytPlayer.pauseVideo();
      }
    }
  }, {
    key: 'paused',
    value: function paused() {
      return this.ytPlayer ? this.lastState !== YT.PlayerState.PLAYING && this.lastState !== YT.PlayerState.BUFFERING : true;
    }
  }, {
    key: 'currentTime',
    value: function currentTime() {
      return this.ytPlayer ? this.ytPlayer.getCurrentTime() : 0;
    }
  }, {
    key: 'setCurrentTime',
    value: function setCurrentTime(seconds) {
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
        this.checkSeekedInPauseInterval = this.setInterval((function () {
          if (this.lastState !== YT.PlayerState.PAUSED || !this.isSeeking) {
            // If something changed while we were waiting for the currentTime to change,
            //  clear the interval timer
            this.clearInterval(this.checkSeekedInPauseInterval);
          } else if (this.currentTime() !== this.timeBeforeSeek) {
            this.trigger('timeupdate');
            this.onSeeked();
          }
        }).bind(this), 250);
      }
    }
  }, {
    key: 'onSeeked',
    value: function onSeeked() {
      this.clearInterval(this.checkSeekedInPauseInterval);
      this.isSeeking = false;

      if (this.wasPausedBeforeSeek) {
        this.pause();
      }

      this.trigger('seeked');
    }
  }, {
    key: 'playbackRate',
    value: function playbackRate() {
      return this.ytPlayer ? this.ytPlayer.getPlaybackRate() : 1;
    }
  }, {
    key: 'setPlaybackRate',
    value: function setPlaybackRate(suggestedRate) {
      if (!this.ytPlayer) {
        return;
      }

      this.ytPlayer.setPlaybackRate(suggestedRate);
      this.trigger('ratechange');
    }
  }, {
    key: 'duration',
    value: function duration() {
      return this.ytPlayer ? this.ytPlayer.getDuration() : 0;
    }
  }, {
    key: 'currentSrc',
    value: function currentSrc() {
      return this.source;
    }
  }, {
    key: 'ended',
    value: function ended() {
      return this.ytPlayer ? this.lastState === YT.PlayerState.ENDED : false;
    }
  }, {
    key: 'volume',
    value: function volume() {
      return this.ytPlayer ? this.ytPlayer.getVolume() / 100.0 : 1;
    }
  }, {
    key: 'setVolume',
    value: function setVolume(percentAsDecimal) {
      if (!this.ytPlayer) {
        return;
      }

      this.ytPlayer.setVolume(percentAsDecimal * 100.0);
      this.setTimeout(function () {
        this.trigger('volumechange');
      }, 50);
    }
  }, {
    key: 'muted',
    value: function muted() {
      return this.ytPlayer ? this.ytPlayer.isMuted() : false;
    }
  }, {
    key: 'setMuted',
    value: function setMuted(mute) {
      if (!this.ytPlayer) {
        return;
      } else {
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
  }, {
    key: 'buffered',
    value: function buffered() {
      if (!this.ytPlayer || !this.ytPlayer.getVideoLoadedFraction) {
        return {
          length: 0,
          start: function start() {
            throw new Error('This TimeRanges object is empty');
          },
          end: function end() {
            throw new Error('This TimeRanges object is empty');
          }
        };
      }

      var _end = this.ytPlayer.getVideoLoadedFraction() * this.ytPlayer.getDuration();

      return {
        length: this.ytPlayer.getDuration(),
        start: function start() {
          return 0;
        },
        end: function end() {
          return _end;
        }
      };
    }

    // TODO: Can we really do something with this on YouTUbe?
  }, {
    key: 'load',
    value: function load() {}
  }, {
    key: 'resetction',
    value: function resetction() {}
  }, {
    key: 'supportsFullScreen',
    value: function supportsFullScreen() {
      return true;
    }

    // Tries to get the highest resolution thumbnail available for the video
  }, {
    key: 'checkHighResPoster',
    value: function checkHighResPoster() {
      var _this = this;

      var uri = 'https://img.youtube.com/vi/' + this.url.videoId + '/maxresdefault.jpg';

      try {
        (function () {
          var image = new Image();
          image.onload = (function () {
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
          }).bind(_this);
          image.onerror = function () {};
          image.src = uri;
        })();
      } catch (e) {}
    }
  }]);

  return Youtube;
})(Tech);

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

var _isOnMobile = /(iPad|iPhone|iPod|Android)/g.test(navigator.userAgent);

Youtube.parseUrl = function (url) {
  var result = {
    videoId: null
  };

  var regex = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  var match = url.match(regex);

  if (match && match[2].length === 11) {
    result.videoId = match[2];
  }

  var regPlaylist = /[?&]list=([^#\&\?]+)/;
  match = url.match(regPlaylist);

  if (match && match[1]) {
    result.listId = match[1];
  }

  return result;
};

var loadApi = function loadApi() {
  var tag = document.createElement('script');
  tag.src = 'https://www.youtube.com/iframe_api';
  var firstScriptTag = document.getElementsByTagName('script')[0];
  firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
};

var injectCss = function injectCss() {
  var css = // iframe blocker to catch mouse events
  '.vjs-youtube .vjs-iframe-blocker { display: none; }' + '.vjs-youtube.vjs-user-inactive .vjs-iframe-blocker { display: block; }' + '.vjs-youtube .vjs-poster { background-size: cover; }' + '.vjs-youtube-mobile .vjs-big-play-button { display: none; }';

  var head = document.head || document.getElementsByTagName('head')[0];

  var style = document.createElement('style');
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
  return source === 'video/youtube';
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
Youtube.nativeSourceHandler.dispose = function () {};

// Register the native source handler
Youtube.registerSourceHandler(Youtube.nativeSourceHandler);

window.onYouTubeIframeAPIReady = function () {
  Youtube.isApiReady = true;

  for (var i = 0; i < Youtube.apiReadyQueue.length; ++i) {
    Youtube.apiReadyQueue[i].initYTPlayer();
  }
};

loadApi();
injectCss();

Component.registerComponent('Youtube', Youtube);

Tech.registerTech('Youtube', Youtube);

exports['default'] = Youtube;
module.exports = exports['default'];