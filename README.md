## Now fully support VideoJS 4.5.1!

# Video.js - YouTube Source Support
Allows you to use a YouTube video within [Video.js](https://github.com/videojs/video.js/) and control it the same way as a regular video (the same methods and events are availables within the tech). It also add the video quality and let you change it as if you were on YouTube.

## Install
All you need is vjs.youtube.js. You can install it through bower: `bower install videojs-youtube` or by simply downloading the last version on GitHub.

## How does it work?
Including the script vjs.youtube.js will add the YouTube as a tech. You just have to add it to your techOrder option. Then, you add the option src with your YouTube URL.

It supports:
- youtube.com as well as youtu.be
- Regular URLs: http://www.youtube.com/watch?v=xjS6SftYQaQ
- Embeded URLs: http://www.youtube.com/embed/xjS6SftYQaQ
- Playlist URLs: http://www.youtube.com/playlist?list=PLA60DCEB33156E51F OR http://www.youtube.com/watch?v=xjS6SftYQaQ&list=SPA60DCEB33156E51F

See the examples

## Additional Options
This plugin exposes the following additional [player options](https://github.com/videojs/video.js/blob/master/docs/guides/options.md):

- `ytcontrols` (Boolean): Display the YouTube player controls instead of the Video.js player controls.
- `quality` (String): Set the default video quality. Should be one of `1080p`, `720p`, `480p`, `360p`, `240p`, `144p`.
- `playsInline` (Boolean): Sets the [`playsinline`](https://developers.google.com/youtube/player_parameters?playerVersion=HTML5#playsinline) YouTube player parameter to enable inline playback on iOS
- `toggleOnClick` (Boolean): Enable default YouTube behaviour of toggling video playback on clicking video
- `forceHTML5` (Boolean): Forces loading the YouTube HTML5 player
- `forceSSL` (Boolean): Forces loading the YouTube API over https

##Special Thank You
Thanks to John Hurliman for the original code on the old Video.js
