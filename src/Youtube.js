/* The MIT License (MIT)

Copyright (c) 2014-2015 Benoit Tremblay <trembl.ben@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE. */
(function() {
  'use strict';

  var Tech = videojs.getComponent('Tech');

  var Youtube = videojs.extends(Tech, {

    constructor: function(options, ready) {
      Tech.call(this, options, ready);
    },

    createEl: function() {
      var div = document.createElement('div');
      div.setAttribute('id', this.options_.techId);
      div.setAttribute('style', 'width:100%;height:100%')

      if (Youtube.isApiReady) {
        this.initYTPlayer();
      } else {
        Youtube._apiReadyQueue.push(this);
      }

      return div;
    },

    initYTPlayer: function() {
      this.ytPlayer = new YT.Player(this.options_.techId, {
        events: {
          onReady: this.onPlayerReady.bind(this),
          onPlaybackQualityChange: this.onPlayerPlaybackQualityChange.bind(this),
          onStateChange: this.onPlayerStateChange.bind(this),
          onError: this.onPlayerError.bind(this)
        }
      });
    },

    onPlayerReady: function() {
      this.ytPlayer.loadVideoById(this.options_.source.src);
    },

    onPlayerPlaybackQualityChange: function() {

    },

    onPlayerStateChange: function() {

    },

    onPlayerError: function() {

    }

  });

  Youtube.isSupported = function() {
    return true;
  };

  Youtube.canPlaySource = function(e) {
    return (e.type === 'video/youtube');
  };

  function loadApi() {
    var tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    var firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
  };

  Youtube._apiReadyQueue = [];

  window.onYouTubeIframeAPIReady = function() {
    Youtube.isApiReady = true;

    for (var i = 0; i < Youtube._apiReadyQueue.length; ++i) {
      Youtube._apiReadyQueue[i].initYTPlayer();
    }
  };

  loadApi();

  videojs.registerComponent('Youtube', Youtube);
})();
