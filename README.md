# YouTube Playback Technology<br />for [Video.js](https://github.com/videojs/video.js) [![Build Status](https://travis-ci.org/eXon/videojs-youtube.svg?branch=master)](https://travis-ci.org/eXon/videojs-youtube)
[![Selenium Test Status](https://saucelabs.com/browser-matrix/videojs-youtube.svg)](https://saucelabs.com/u/videojs-youtube)
<br /><br />
YouTube playback technology for the [Video.js player](https://github.com/videojs/video.js/).

## Install
You can use bower (`bower install videojs-youtube`), npm (`npm install videojs-youtube`) or the source and build it using `grunt`. Then, the only file you need is dist/vjs.youtube.js.

## Example
```html
<!DOCTYPE html>
<html>
<head>
  <link type="text/css" rel="stylesheet" href="https://vjs.zencdn.net/4.5.1/video-js.css" />
  <script src="https://vjs.zencdn.net/4.5.1/video.js"></script>
  <script src="vjs.youtube.js"></script>
</head>
<body>
  <video id="vid1" src="" class="video-js vjs-default-skin" controls preload="auto" width="640" height="360" data-setup='{ "techOrder": ["youtube"], "src": "http://www.youtube.com/watch?v=xjS6SftYQaQ" }'>
  </video>
</body>
</html>
```


See the examples folder for more

## How does it work?
Including the script vjs.youtube.js will add the YouTube as a tech. You just have to add it to your techOrder option. Then, you add the option src with your YouTube URL.

It supports:
- youtube.com as well as youtu.be
- Regular URLs: http://www.youtube.com/watch?v=xjS6SftYQaQ
- Embeded URLs: http://www.youtube.com/embed/xjS6SftYQaQ
- Playlist URLs: http://www.youtube.com/playlist?list=PLA60DCEB33156E51F OR http://www.youtube.com/watch?v=xjS6SftYQaQ&list=SPA60DCEB33156E51F

## Additional Options
This plugin exposes the following additional [player options](https://github.com/videojs/video.js/blob/master/docs/guides/options.md):

- `ytcontrols` (Boolean): Display the YouTube player controls instead of the Video.js player controls. (default `false`)
- `quality` (String): Set the default video quality. Should be one of `1080p`, `720p`, `480p`, `360p`, `240p`, `144p`.
- `playsInline` (Boolean): Sets the [`playsinline`](https://developers.google.com/youtube/player_parameters?playerVersion=HTML5#playsinline) YouTube player parameter to enable inline playback on iOS
- `forceHTML5` (Boolean): Forces loading the YouTube HTML5 player (default `true`)
- `forceSSL` (Boolean): Forces loading the YouTube API over https (default `true`)

##Special Thank You
Thanks to Steve Heffernan for the amazing Video.js and to John Hurliman for the original version of the YouTube tech
