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
 * Constructs a colour level filter.
 *
 * @class A very basic colour level filter.
 * @param {number} red The multiplier for the red channel.
 * @param {number} green The multiplier for the green channel.
 * @param {number} blue The multiplier for the blue channel.
 */
cinejs.filters.ColourLevel = function (red, green, blue) {
	this.red = red;
	this.green = green;
	this.blue = blue;
};

/**
 * The processing function for the colour level filter.
 *
 * @param {ImageData} frame
 * @param {HTMLCanvasElement} canvas
 */
cinejs.filters.ColourLevel.prototype.processFrame = function (frame, canvas) {
	for (var i = 0; i < frame.data.length; i += 4) {
		frame.data[i + 0] = Math.min(frame.data[i + 0] * this.red, 255);
		frame.data[i + 1] = Math.min(frame.data[i + 1] * this.green, 255);
		frame.data[i + 2] = Math.min(frame.data[i + 2] * this.blue, 255);
	}
};

// This one's for my vowel deprived American friends.
cinejs.filters.ColorLevel = cinejs.filters.ColourLevel;


// vim: set cin noet ts=8 sw=8:
