## Now fully support VideoJS 4.3.0!

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

Here is 3 examples:
<ol>
  <li>using autoplay/loop/muted</li>
  <li>using YouTube controls</li>
  <li>using JavaScript events</li>
</ol>


```html
<!DOCTYPE html>
<html>
  <head>
    <link href="video-js.min.css" rel="stylesheet" />
  </head>
  
  <body>
    <video id="vid1" src="" class="video-js vjs-default-skin" controls 
           preload="auto" autoplay="autoplay" loop="loop" width="640" height="360" 
           data-setup='{ "techOrder": ["youtube"], "src": "http://www.youtube.com/watch?v=xjS6SftYQaQ" }'>
    </video>
    <br />
    
    <video id="vid2" src="" class="video-js vjs-default-skin" controls 
           preload="auto" width="640" height="360" 
           data-setup='{ "techOrder": ["youtube"], "src": "http://www.youtube.com/watch?v=xjS6SftYQaQ", "ytcontrols": true }'>
    </video>
    <br />
    
    <video id="vid3" src="" class="video-js vjs-default-skin" controls
           preload="auto" width="640" height="360">
    </video>
    
    <script src="video.min.js"></script>
    <script src="vjs.youtube.js"></script>
    <script>
    videojs('vid3', { "techOrder": ["youtube"], "src": "http://www.youtube.com/watch?v=xjS6SftYQaQ" }).ready(function() {
      // Cue a video using ended event
      this.one('ended', function() {
        this.src('http://www.youtube.com/watch?v=jofNR_WkoCE');
      });
    });
    </script>
  </body>
</html>
```

## Additional Options
This plugin exposes the following additional [player options](https://github.com/videojs/video.js/blob/master/docs/guides/options.md):

- `ytcontrols` (Boolean): Display the YouTube player controls instead of the Video.js player controls.
- `quality` (String): Set the default video quality. Should be one of `1080p`, `720p`, `480p`, `360p`, `240p`, `144p`.
- `playsInline` (Boolean): Sets the [`playsinline`](https://developers.google.com/youtube/player_parameters?playerVersion=HTML5#playsinline) YouTube player parameter to enable inline playback on iOS

## Safari Glitch
If your video tag is empty (no space or new line before the closing tag), it will create a glitch with Safari. Instead of writing `<video ...></video>`, you should write `<video ...> </video>`.

##Special Thank You
Thanks to John Hurliman for the original code on the old Video.js
