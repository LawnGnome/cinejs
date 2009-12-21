/* Copyright © 2009 Adam Harvey
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
 * @namespace Encapsulates the various filters provided with CineJS.
 */
cinejs.filters = {};


cinejs.filters.ColourLevel = function (red, green, blue) {
	this.red = red;
	this.green = green;
	this.blue = blue;
};

cinejs.filters.ColourLevel.prototype.processFrame = function (frame) {
	for (var i = 0; i < frame.data.length; i += 4) {
		frame.data[i + 0] *= this.red;
		frame.data[i + 1] *= this.green;
		frame.data[i + 2] *= this.blue;
	}
};

cinejs.filters.ColorLevel = cinejs.filters.ColourLevel;


// vim: set cin noet ts=8 sw=8:
