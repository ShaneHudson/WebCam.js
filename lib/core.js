/* *
 * @package Webcam.js
 * @subpackage webcam/core.js
 * Copyright (c) 2012 Shane Hudson
 * MIT License
 * */

define(['lib/polyfill', 'lib/manipulation', 'lib/gestures'],function(polyfill, manipulation, gestures) {
	var webcam = {
		VERSION: '0.1'
	};

	var videoElement = document.createElement("video");
	var canvas = document.createElement('canvas');
	var width = 465; var height = 350;
	canvas.width = width; canvas.height = height;
	var ctx = canvas.getContext('2d');
	videoElement.width = width; videoElement.height = height;
	var horizontalResolution;
	var verticalResolution;

	window.URL = window.URL || window.webkitURL;
	navigator.getUserMedia  = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;

	if (navigator.getUserMedia === undefined) {
		if (console !== undefined) {
			console.log("Browser doesn't support getUserMedia");
			return;
		}
	}


	navigator.getUserMedia({video: true}, function (stream) {
		// Create a video element and set its source to the stream from the webcam
		//videoElement.style.display = "none";
		videoElement.autoplay = true;
		document.getElementsByTagName("body")[0].appendChild(videoElement);
		if (window.URL === undefined) {
			window.URL = window.webkitURL;
		}
		videoElement.src = window.URL.createObjectURL(stream);
	});

	videoElement.addEventListener("canPlay", function() {

		horizontalResolution = videoElement.videoWidth;
		verticalResolution = videoElement.videoHeight;
		
		if (horizontalResolution < 1 || horizontalResolution > 4000) {
			console.log("Webcam error.  Try reloading the page.");
		}

	});

	function getVideo()  {
		return videoElement;
	}

	function getHorizontalResolution() {
		return horizontalResolution;
	}

	function getVerticalResolution() {
		return verticalResolution;
	}

	function draw() {
		requestAnimationFrame(draw);
		//var data = manipulation.desaturate(videoElement);
		//gestures.analyseFrame(data);
		//var data = manipulation.sepia(videoElement);
		// Broken: var data = manipulation.mirror();
		//var data = manipulation.motionDetection(videoElement);
		var data = manipulation.fillMotionDetection(videoElement);
		//var data = manipulation.invert(videoElement);
		ctx.putImageData(data, 0, 0);
		canvas.style.position = 'absolute';
		canvas.style.top = '0px';
		canvas.style.left = '0px';
	}

	videoElement.addEventListener("play", function() {
		document.getElementsByTagName("body")[0].appendChild(canvas);
		manipulation.setup(videoElement,width,height,ctx);
		draw();

	},false);

	return {
		getVideo : getVideo(),
		getVerticalResolution : getVerticalResolution(),
		getHorizontalResolution : getHorizontalResolution()
	};
});