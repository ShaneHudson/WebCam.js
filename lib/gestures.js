/* *
 * @package Webcam.js
 * @subpackage webcam/gestures.js
 * Copyright (c) 2012 Shane Hudson
 * MIT License
 * */

define(['lib/core','lib/manipulation'],function(core, manipulation) {

	var w;
	var h;
	var oldData;
	var FRAME_THRESHOLD_X = 2000000;
	var FRAME_THRESHOLD_Y = 400000;
	var PIXEL_CHANGE_THRESHOLD = 30;

	var currentWeightX = 0;
	var currentWeightY = 0;

	function fireEvent(eventName) {
		var gestureEvent = document.createEvent("UIEvents");
		gestureEvent.initEvent(eventName, false, false);
		document.getElementsByTagName("body")[0].dispatchEvent(gestureEvent);
	}

	function analyseFrame(data) {
		var saturated = data;
		if (oldData)
		{
			currentWeightX = getMotionWeight(oldData, saturated, 'x');
			currentWeightY = getMotionWeight(oldData, saturated, 'y');
			if (currentWeightX < -FRAME_THRESHOLD_X)
			{
				fireEvent('webcamSwipeRight');
			}
			else if (currentWeightX > FRAME_THRESHOLD_X)
			{
				fireEvent('webcamSwipeLeft');
			}

			if (currentWeightY < -FRAME_THRESHOLD_Y)
			{
				fireEvent('webcamSwipeDown');
			}
			else if (currentWeightY > FRAME_THRESHOLD_Y)
			{
				fireEvent('webcamSwipeUp');
			}
		}
		else
		{
			oldData = saturated;
			w = saturated.width;
			h = saturated.height;
		}
	}

	// direction would be "x" or 'y' (z may be possible later)
	function getMotionWeight(previous, current, direction)
	{
		var motionWeight = 0;
		var previousData = previous.data;
		var currentData = current.data;
		var dataLength = previousData.length;
		if (direction === 'x')
		{
			for (var i = 0; i < dataLength; i += 4) {
				if (Math.abs(currentData[i] - previousData[i]) > PIXEL_CHANGE_THRESHOLD) {
					motionWeight += ((i / 4) % w) - (w / 2);
				}
			}
		}
		else {
			for( var x = 0; x < h; x++ ) {
	  			for( var y = 0; y < w; y++ ) {
	  				var i = (y * w + x) * 4;
	  				if (Math.abs(currentData[i] - previousData[i]) > PIXEL_CHANGE_THRESHOLD)  {
	  					motionWeight += ((i / 4) % h) - (h / 2);
	  				}
	  			}
	  		}
		}
		
		return motionWeight;
	}

	// Will return the average intensity of all pixels.  Used for calibrating sensitivity based on room light level.
	function getLightLevel (imageData) {
		var theData = imageData.data;
		var dataLength = theData.length;

		var value = 0;
		for (var i = 0; i < dataLength; i += 4) {
			value += theData[i];
		}

		return value / theData.length;
	}

	return {
		test : function () {
			return "TEST";
		},
		analyseFrame : function(data) {
			analyseFrame(data);
		},
		getLightLevel : function(data) {
			return getLightLevel(data);
		}
	};
});