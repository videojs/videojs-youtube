/**
 * @fileoverview YouTube Media Controller - Wrapper for YouTube Media API
 */

/**
 * YouTube Media Controller - Wrapper for YouTube Media API
 * @param {vjs.Player|Object} player
 * @param {Object=} options
 * @param {Function=} ready
 * @constructor
 */
vjs.Youtube = function(player, options, ready){
  goog.base(this, player, options, ready);

  // Regex that parse the video ID for any YouTube URL
  var regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  var match = options.source.src.match(regExp);

  if (match && match[2].length == 11){
    this.videoId = match[2];

    // Show the YouTube poster only if we don't use YouTube poster (otherwise the controls pop, it's not nice)
    if (!this.player_.options_.ytcontrols){
      this.player_.poster('http://img.youtube.com/vi/' + this.videoId + '/0.jpg');

      // Cover the entire iframe to have the same poster than YouTube
      // Doesn't exist right away because the DOM hasn't created it
      var self = this;
      setTimeout(function(){ self.player_.posterImage.el_.style.backgroundSize = 'cover'; }, 50);
    }
  }

  this.id_ = this.player_.id() + '_youtube_api';

  var params = {
    enablejsapi: 1,
    iv_load_policy: 3,
    playerapiid: this.id(),
    disablekb: 1,
    controls: (this.player_.options_.ytcontrols)?1:0,
    showinfo: 0,
    modestbranding: 1,
    rel: 0,
    origin: window.location.origin,
    autoplay: (this.player_.options_.autoplay)?1:0,
    loop: (this.player_.options_.loop)?1:0
  };

  this.el_.src = 'http://www.youtube.com/embed/' + this.videoId + '?' + vjs.Youtube.makeQueryString(params);

  if (this.player_.options_.ytcontrols){
    // Hide the big play button when using YouTube controls
    // Doesn't exist right away because the DOM hasn't created it
    var self = this;
    setTimeout(function(){ self.player_.bigPlayButton.hide(); }, 50);
  }

  if (vjs.Youtube.apiReady){
    this.loadYoutube();
  } else {
    // Add to the queue because the YouTube API is not ready
    vjs.Youtube.loadingQueue.push(this);

    // Load the YouTube API if it is the first YouTube video
    if(!vjs.Youtube.apiLoading){
      var tag = vjs.createEl('script', { src: 'http://www.youtube.com/iframe_api' });
      var firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
      vjs.Youtube.apiLoading = true;
    }
  }
};
goog.inherits(vjs.Youtube, vjs.MediaTechController);

vjs.Youtube.prototype.dispose = function(){
  goog.base(this, 'dispose');
  this.ytplayer.destroy();
};

vjs.Youtube.prototype.createEl = function(){
  var player = this.player_;

  var iframe = vjs.createEl('iframe', {
    id: player.id() + '_youtube_api',
    className: 'vjs-tech',
    scrolling: 'no',
    marginWidth: 0,
    marginHeight: 0,
    frameBorder: 0,
    webkitAllowFullScreen: '',
    mozallowfullscreen: '',
    allowFullScreen: ''
  });

  vjs.insertFirst(iframe, player.el());

  return iframe;
};

vjs.Youtube.prototype.play = function(){
  if (this.player_.isReady_){ 
    this.ytplayer.playVideo(); 
  } else { 
    // We will play it when the API will be ready
    this.playOnReady = true;
      
    if (!this.player_.options.ytcontrols) {
      // Keep the big play button until it plays for real
      this.player_.bigPlayButton.show();
    }
  }
};

vjs.Youtube.prototype.pause = function(){ this.ytplayer.pauseVideo(); };
vjs.Youtube.prototype.paused = function(){
  return this.lastState !== YT.PlayerState.PLAYING &&
         this.lastState !== YT.PlayerState.BUFFERING;
};

vjs.Youtube.prototype.currentTime = function(){ return this.ytplayer.getCurrentTime(); };

vjs.Youtube.prototype.setCurrentTime = function(seconds){
  this.ytplayer.seekTo(seconds, true);
  this.player_.trigger('timeupdate');
};

vjs.Youtube.prototype.duration = function(){ return this.ytplayer.getDuration(); };
vjs.Youtube.prototype.buffered = function(){
  var loadedBytes = this.ytplayer.getVideoBytesLoaded();
  var totalBytes = this.ytplayer.getVideoBytesTotal();
  if (!loadedBytes || !totalBytes) return 0;

  var duration = this.ytplayer.getDuration();
  var secondsBuffered = (loadedBytes / totalBytes) * duration;
  var secondsOffset = (this.ytplayer.getVideoStartBytes() / totalBytes) * duration;
  return vjs.createTimeRange(secondsOffset, secondsOffset + secondsBuffered);
};

vjs.Youtube.prototype.volume = function() { 
  if (isNaN(this.volumeVal)) {
    this.volumeVal = this.ytplayer.getVolume() / 100.0;
  }

  return this.volumeVal;
};

vjs.Youtube.prototype.setVolume = function(percentAsDecimal){
  if (percentAsDecimal && percentAsDecimal != this.volumeVal) {
    this.ytplayer.setVolume(percentAsDecimal * 100.0); 
    this.volumeVal = percentAsDecimal;
    this.player_.trigger('volumechange');
  }
};

vjs.Youtube.prototype.muted = function() { return this.ytplayer.isMuted(); };
vjs.Youtube.prototype.setMuted = function(muted) { 
  if (muted) {
    this.ytplayer.mute(); 
  } else { 
    this.ytplayer.unMute(); 
  } 

  var self = this;
  setTimeout(function() { self.player_.trigger('volumechange'); }, 50);
};

vjs.Youtube.prototype.onReady = function(){
  this.player_.trigger('techready');

  // Hide the poster when ready because YouTube has it's own
  this.player_.posterImage.hide();
  this.triggerReady();
  this.player_.trigger('durationchange');

  // Play right away if we clicked before ready
  if (this.playOnReady){
    this.player_.bigPlayButton.hide();
    this.ytplayer.playVideo();
  }

  if (!this.player_.options_.controls || this.player_.options_.ytcontrols){
    // Hide the VideoJS controls
    this.player_.controlBar.hide();
  }
};

vjs.Youtube.prototype.onStateChange = function(state){
  if (state != this.lastState){
    switch(state){
      case -1:
        this.player_.trigger('durationchange');
        break;

      case YT.PlayerState.ENDED:
        this.player_.trigger('ended');

        if (!this.player_.options_.ytcontrols){
          this.player_.bigPlayButton.show();
        }
        break;

      case YT.PlayerState.PLAYING:
        this.player_.trigger('timeupdate');
        this.player_.trigger('durationchange');
        this.player_.trigger('playing');
        this.player_.trigger('play');
        break;

      case YT.PlayerState.PAUSED:
        this.player_.trigger('pause');
        break;

      case YT.PlayerState.BUFFERING:
        this.player_.trigger('timeupdate');
        this.player_.trigger('waiting');

        // Hide the waiting spinner since YouTube has its own
        this.player_.loadingSpinner.hide();
        break;

      case YT.PlayerState.CUED:
        break;
    }

    this.lastState = state;
  }
};

vjs.Youtube.prototype.onPlaybackQualityChange = function(quality){
  switch(quality){
    case 'medium':
      this.player_.videoWidth = 480;
      this.player_.videoHeight = 360;
      break;

    case 'large':
      this.player_.videoWidth = 640;
      this.player_.videoHeight = 480;
      break;

    case 'hd720':
      this.player_.videoWidth = 960;
      this.player_.videoHeight = 720;
      break;

    case 'hd1080':
      this.player_.videoWidth = 1440;
      this.player_.videoHeight = 1080;
      break;

    case 'highres':
      this.player_.videoWidth = 1920;
      this.player_.videoHeight = 1080;
      break;

    case 'small':
      this.player_.videoWidth = 320;
      this.player_.videoHeight = 240;
      break;

    default:
      this.player_.videoWidth = 0;
      this.player_.videoHeight = 0;
      break;
  }

  this.player_.trigger('ratechange');
};

vjs.Youtube.prototype.onError = function(error){
  this.player_.error = error;
  this.player_.trigger('error');
};

vjs.Youtube.isSupported = function(){
  return true;
};

vjs.Youtube.canPlaySource = function(srcObj){
  return (srcObj.type == 'video/youtube');
};

vjs.Youtube.prototype.features = {
  fullscreen: true,
  volumeControl: true,

  // Optional events that we can manually mimic with timers
  // currently not triggered by video-js-swf
  progressEvents: false,
  timeupdateEvents: false
};

// All videos created before YouTube API is loaded
vjs.Youtube.loadingQueue = [];

// Create the YouTube player
vjs.Youtube.prototype.loadYoutube = function(){
  this.ytplayer = new YT.Player(this.id(), {
    events: {
      onReady: function(e) { e.target.vjsTech.onReady(); },
      onStateChange: function(e) { e.target.vjsTech.onStateChange(e.data); },
      onPlaybackQualityChange: function(e){ e.target.vjsTech.onPlaybackQualityChange(e.data); },
      onError: function(e){ e.target.vjsTech.onError(e.data); }
    }
  });

  this.ytplayer.vjsTech = this;
};

vjs.Youtube.makeQueryString = function(args){
  var array = [];
  for (var key in args){
    if (args.hasOwnProperty(key)){
      array.push(encodeURIComponent(key) + '=' + encodeURIComponent(args[key]));
    }
  }

  return array.join('&');
};

// Called when YouTube API is ready to be used
window.onYouTubeIframeAPIReady = function(){
  var yt;
  while ((yt = vjs.Youtube.loadingQueue.shift())){
    yt.loadYoutube();
  }
  vjs.Youtube.loadingQueue = [];
}