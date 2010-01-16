/* Copyright © 2009-2010 Adam Harvey
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to
 * deal in the Software without restriction, including without limitation the
 * rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
 * sell copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
 * IN THE SOFTWARE.
 */


/**
 * @namespace Namespace for utility functions.
 */
cinejs.util = {internal: {}};


/**
 * Converts a HSV colour value to RGB.
 *
 * @param {number} hue The hue in degrees. Expected to be in the range 0-360,
 *                     or -1 if the colour is greyscale.
 * @param {number} saturation The saturation as a number from 0-1.
 * @param {number} value The colour value. Between 0 and 255.
 * @return {array} An array of colour values: [red, green, blue].
 */
cinejs.util.hsvToRgb = function (hue, saturation, value) {
	// Check for the simple greyscale case.
	if (saturation === 0.0) {
		return [value, value, value];
	}

	hue %= 360.0;
	hue /= 60.0;

	/* This particular piece of unclear goobledigook is brought to you by
	 * Blender and Peter Schlaile. */
	var i = Math.floor(hue);
	var f = hue - i;
	var w = value * (1.0 - saturation);
	var q = value * (1.0 - (saturation * f));
	var t = value * (1.0 - (saturation * (1.0 - f)));

	return cinejs.util.internal.rgbType[i](value, w, q, t);
};


/**
 * Converts an RGB colour value to HSV.
 *
 * @param {number} red The red colour value.
 * @param {number} green The green colour value.
 * @param {number} blue The blue colour value.
 * @return {array} An array of colour values: [hue, saturation, value].
 */
cinejs.util.rgbToHsv = function (red, green, blue) {
	var max = red;
	var min = red;
	var maxChannel = "red";

	// Find the maximum colour value.
	if (green > max) {
		max = green;
		maxChannel = "green";
	}
	if (blue > max) {
		max = blue;
		maxChannel = "blue";
	}

	// Do the same for the minimum.
	if (green < min) {
		min = green;
	}
	if (blue < min) {
		min = blue;
	}

	// Calculate saturation.
	var saturation = 0.0;
	if (max !== 0.0) {
		saturation = (max - min) / max;
	}

	/* And now the hue. It doesn't overly matter what we return for
	 * greyscale images, for obvious reasons. */
	var hue = 0.0;
	if (saturation !== 0.0) {
		var delta = max - min;

		if (maxChannel === "red") {
			hue = (green - blue) / delta;
		}
		else if (maxChannel === "green") {
			hue = 2.0 + (blue - red) / delta;
		}
		else {
			hue = 4.0 + (red - green) / delta;
		}

		hue *= 60.0;

		if (hue < 0.0) {
			hue += 360.0;
		}
	}

	return [hue, saturation, max];
};


/**
 * Internal helper functions for HSV. We'll define these here rather than in
 * hsvToRgb() to save redeclaring them on each invocation.
 */
cinejs.util.internal.rgbType = [
	function (value, w, q, t) { return [value, t, w]; },
	function (value, w, q, t) { return [q, value, w]; },
	function (value, w, q, t) { return [w, value, t]; },
	function (value, w, q, t) { return [w, q, value]; },
	function (value, w, q, t) { return [t, w, value]; },
	function (value, w, q, t) { return [value, w, q]; }
];


// vim: set cin noet ts=8 sw=8:
