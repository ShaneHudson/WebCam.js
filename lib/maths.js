/* *
 * @package Webcam.js
 * @subpackage webcam/maths.js
 * Copyright (c) 2012 Shane Hudson
 * MIT License
 * */

define(function() {

	// Credit to Ryan Lamvohee
	function linearInterpolation(from, to, amount)  {
		return from + amount * (to - from);
	}

	return {
		lerp: function ()  {
			return linearInterpolation(from, to, amount);
		}
	};
});