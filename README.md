# Video.js - YouTube Source Support
Allows you to use YouTube URL as source with [Video.js](https://github.com/zencoder/video-js/).

## How does it work?
Including the script vjs.youtube.js will add the YouTube as a tech. You just have to add it to your techOrder option.

Here is an example:

	<link href="http://vjs.zencdn.net/c/video-js.css" rel="stylesheet">
	<script src="http://vjs.zencdn.net/c/video.js"></script>
	<script src="vjs.youtube.js"></script>
	<video id="vid1" class="video-js vjs-default-skin" controls preload="auto" width="640" height="360" data-setup='{ "techOrder": ["youtube", "html5", "flash"] }'>
	  <source src="http://www.youtube.com/watch?v=ebO5jK5NKXw" type="video/youtube">
	  <p>Video Playback Not Supported</p>
	</video>

## Additional Informations
ytcontrols: Display the YouTube controls instead of Video.js.

## Warning
It will not run properly without a Web server.

##Special Thank You
Thanks to John Hurliman for the original code on the old Video.js