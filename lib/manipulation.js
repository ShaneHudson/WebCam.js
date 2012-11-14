/* *
 * @package Webcam.js
 * @subpackage webcam/manipulation.js
 * Copyright (c) 2012 Shane Hudson
 * MIT License
 * */

define(['lib/maths'], function(maths) {
	var buffer;
	var manip;
	var bctx;
	var w;
	var h;
	var ctx;
	var video;

	var oldData; // Used for motion detection

	function setup(videoElement, width, height, context)  {
		buffer = document.createElement('canvas');
		buffer.width = width;
		buffer.height = height;
		bctx = buffer.getContext('2d');
		w = buffer.width;
		h = buffer.height;
		ctx = context;
		video = videoElement;

	}

	function drawSepiaFrame(video) {
		bctx.drawImage(video, 0, 0, w, h);
		manip = bctx.getImageData(0, 0, w, h);
		var data = manip.data;

		for(var i = 0; i < data.length; i+=4)
		{
			var r = data[i],
				g = data[i+1],
				b = data[i+2];
			data[i] = (r * .393) + (g *.769) + (b * .189);
			data[i+1] = (r * .349) + (g *.686) + (b * .168);
			data[i+2] = (r * .272) + (g *.534) + (b * .131);
		}
		return manip;

		if (video.paused || video.ended) {
		  return;
		}
	}

	// Not working yet
	function drawMirrorFrame() {
		bctx.drawImage(video, 0, 0, w, h);
		manip = bctx.getImageData(0, 0, w, h);
		var data = manip.data;
		var tmp = data;
		var length = w * h;

		return manip;

		if (video.paused || video.ended) {
		  return;
		}
	}

	// http://stackoverflow.com/questions/9320953/what-algorithm-does-photoshop-use-to-desaturate-an-image
	function drawDesaturatedFrame(video) {
		bctx.drawImage(video, 0, 0, w, h);
		manip = bctx.getImageData(0, 0, w, h);
		var data = manip.data;

		// Iterate through each pixel, desaturating it
		for (var i = 0; i < data.length; i += 4) {
			var r = data[i],
				g = data[i+1],
				b = data[i+2];
			data[i] = (r * .3) + (g *.59) + (b * .11);
			data[i+1] = (r * .3) + (g *.59) + (b * .11);
			data[i+2] = (r * .3) + (g *.59) + (b * .11);
		}

		return manip;

		if (video.paused || video.ended) {
		  return;
		}
	}

	function drawMotionDetectionFrame(video) {
		oldData = bctx.getImageData(0, 0, w, h).data;
		bctx.drawImage(video, 0, 0, w, h);
		manip = bctx.getImageData(0, 0, w, h);
		var data = manip.data;

		// Iterate through each pixel, changing to 255 if it has not changed
		for( var y = 0 ; y < h; y++ ) {
  			for( var x = 0 ; x < w; x++ ) {
    			var indexOld = (y * w + x) * 4,
						oldr = oldData[indexOld],
						oldg = oldData[indexOld+1],
						oldb = oldData[indexOld+2],
						olda = oldData[indexOld+3];
    			var indexNew = (y * w + x) * 4,
						r = data[indexNew],
						g = data[indexNew+1],
						b = data[indexNew+2],
						a = data[indexNew+3];

				if (oldr > r - 15 || oldg > g - 15 || oldb > b - 15)
				{
					data[indexNew] = 255;
					data[indexNew+1] = 255;
					data[indexNew+2] = 255;
					data[indexNew+3] = 255;
					detected = true;
				}
				else
				{
					data[indexNew] = 255;
					data[indexNew+1] = 0;
					data[indexNew+2] = 0;
					data[indexNew+3] = 255;
				}
  			}
		}

		return manip;

		if (video.paused || video.ended) {
		  return;
		}
	}

	var skinCalibration = 0;
	function drawFilledMotionDetectionFrame(video) {
		oldData = bctx.getImageData(0, 0, w, h).data;
		bctx.drawImage(video, 0, 0, w, h);
		manip = bctx.getImageData(0, 0, w, h);
		bctx.fillRect(0,0,100,100);

		var data = manip.data;
		var r = 0, g = 0, b = 0, a = 0;

		var motionMap = [,];
		var boxX = w; var boxY = h;
		var boxXEnd = w; var boxYEnd = h;

		for (var i = 0; i < 16; i++) 
		{
			for (var j = 0; j < 11; j++)
			{
				//console.log("i = " + i + " j = " + j);
				// Iterate through each pixel, changing to 255 if it has not changed
				var counter = 0;
				for( var x = 0 ; x < 31; x++ ) {
		  			for( var y = 0 ; y < 31; y++ ) {
		    			var index = (((j *31) + y) * w + ((i*31) + x)) * 4;
						r += data[index];
						g += data[index+1];
						b += data[index+2];
						a = data[index+3];
		    			++counter;
		  			}
				}

				//console.log("counter = " + counter + " r = " + r + " g = " + g + " b = " + b);

				r = r / counter;
				g = g / counter;
				b = b / counter;

				// High pass to reduce dark colours
				var colourMultiplyer = 5.5;
				var colourDivider = 4;

				r = r / colourDivider;
				g = g / colourDivider;
				b = b / colourDivider;

				if (r < 20) r = 0;
				if (g < 20) g = 0;
				if (b < 20) b = 0;

				if (r > 230) r = 255;
				if (g > 230) g = 255;
				if (b > 230) b = 255;

				r = r * colourMultiplyer;
				g = g * colourMultiplyer;
				b = b * colourMultiplyer;

				//console.log("r = " + r + " g = " + g + " b = " + b);

				for( var x = 0 ; x < 31; x++ ) {
		  			for( var y = 0 ; y < 31; y++ ) {
		    			var index = (((j *31) + y) * w + ((i*31) + x)) * 4;
		    			data[index] = r;
		    			data[index+1] = g;
		    			data[index+2] = b;
		  			}
				}
			}
		}



		if (skinCalibration == 0)
		{
			for (var i = 7; i < 9; i++) 
			{
				for (var j = 6; j < 8; j++)
				{
		    		var index = (((j *31) + y) * w + ((i*31) + x)) * 4;
		    		skinCalibration += data[index];
		    		skinCalibration += data[index+1];
		    		skinCalibration += data[index+2];
				}
			}
			skinCalibration = skinCalibration / 9;
			//console.log(skinCalibration);
		}
		else {
			for (var i = 0; i < 16; i++) 
			{
				for (var j = 0; j < 11; j++)
				{
		    		var index = (((j *31) + y) * w + ((i*31) + x)) * 4;
		    		var average = (data[index] + data[index+1] + data[index+2]) / 3;
		    		//console.log("Average: " + average + " Calibration: " + skinCalibration);
		    		if (average < (skinCalibration + 20) && average > (skinCalibration - 20))
		    		{
		    			motionMap[[i,j]] = 1;
		    		}
		    		else {
		    			motionMap[[i,j]] = 0;	
						data[index] = 0;
						data[index+1] = 0;
						data[index+2] = 0;
		    		}
				}
			}

			for (var i = 0; i < 16; i++) 
			{
				for (var j = 0; j < 11; j++)
				{
					if (motionMap[[i,j]] == 1 && i < boxX)
					{
						boxX = i;
					}
					if (motionMap[[i,j]] == 1 && j < boxY)
					{
						boxY = j;
					}
		    		var index = (((j *31) + y) * w + ((i*31) + x)) * 4;
					if (motionMap[[i,j]] == 1)
					{
						var hasAdjacent = false;
						for (var a = -1; a < 1; a++)
						{
							if (motionMap[[i+a,j]] == 1)
							{
								hasAdjacent = true;
							}
						}

						for (var b = -1; b < 1; b++)
						{
							if (motionMap[[i,j+b]] == 1)
							{
								hasAdjacent = true;
							}
						}


						if (hasAdjacent == false)
						{
							motionMap[i,j] = 0;
							data[index] = 0;
							data[index+1] = 0;
							data[index+2] = 0;
						}
					}
				}
			}

			//console.log("BoxX: " + boxX + " BoxY: " + boxY);
			//console.log(motionMap);
		}

		var coords = [boxX, boxY];
		//console.log(coords);

		bctx.putImageData(manip, 0, 0);
		bctx.fillStyle = '#83F52C';
		bctx.clearRect (0, 0, w, h);
		bctx.strokeRect(boxX*31, boxY*31, 150, 150);
		bctx.save();
		return bctx.getImageData(0, 0, w, h);

		if (video.paused || video.ended) {
		  return;
		}
	}

	function drawInvertedFrame(video)  {
		bctx.drawImage(video, 0, 0, w, h);
		manip = bctx.getImageData(0, 0, w, h);
		var data = manip.data;

		// Iterate through each pixel, desaturating it
		for (var i = 0; i < data.length; i += 4) {
			var r = data[i],
				g = data[i+1],
				b = data[i+2];
			data[i] = 255 - r;
			data[i+1] = 255 - g;
			data[i+2] = 255 - b;
		}

		return manip;

		if (video.paused || video.ended) {
		  return;
		}
	}

	return {
		test : function () {
			return "TEST";
		},
		sepia : function(video) {
			return drawSepiaFrame(video);
		},
		mirror : function(video) {
			return drawMirrorFrame(video);
		},
		desaturate : function(video) {
			return drawDesaturatedFrame(video);
		},
		motionDetection : function(video)  {
			return drawMotionDetectionFrame(video);
		},
		fillMotionDetection : function(video) {
			return drawFilledMotionDetectionFrame(video);
		},
		invert : function(video)  {
			return drawInvertedFrame(video);
		},
		setup : function(width, height, context) {
			setup(width, height, context);
		}
	};
});