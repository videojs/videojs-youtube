## Now fully support VideoJS 4.3.0!

# Video.js - YouTube Source Support
Allows you to use YouTube URL as source with [Video.js](https://github.com/zencoder/video-js/).

## How does it work?
Including the script vjs.youtube.js will add the YouTube as a tech. You just have to add it to your techOrder option. Then, you add the option src with your YouTube URL.

It supports:
- youtube.com as well as youtu.be
- Regular URLs: http://www.youtube.com/watch?v=xjS6SftYQaQ
- Embeded URLs: http://www.youtube.com/embed/xjS6SftYQaQ
- Playlist URLs: http://www.youtube.com/playlist?list=PLA60DCEB33156E51F OR http://www.youtube.com/watch?v=xjS6SftYQaQ&list=SPA60DCEB33156E51F

**You must use the last version of VideoJS available in the folder lib, the current version on CDN will not work until it is updated**

Here is an example:

	<link href="video-js.css" rel="stylesheet">
	<script src="video.js"></script>
	<script src="vjs.youtube.js"></script>
	<video id="vid1" src="" class="video-js vjs-default-skin" controls preload="auto" width="640" height="360" data-setup='{ "techOrder": ["youtube"], "src": "http://www.youtube.com/watch?v=xjS6SftYQaQ&list=SPA60DCEB33156E51F" }'></video>

## Additional Informations
ytcontrols: Display the YouTube controls instead of Video.js.

##Special Thank You
Thanks to John Hurliman for the original code on the old Video.js