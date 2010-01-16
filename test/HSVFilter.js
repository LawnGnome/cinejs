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


var HSVFilter = function () {
};


HSVFilter.prototype.processFrame = function (frame, canvas) {
	for (var i = 0; i < frame.data.length; i += 4) {
		var hsv = cinejs.util.rgbToHsv(frame.data[i + 0], frame.data[i + 1], frame.data[i + 2]);
		var rgb = cinejs.util.hsvToRgb(hsv[0], hsv[1], hsv[2]);
		frame.data[i + 0] = rgb[0];
		frame.data[i + 1] = rgb[1];
		frame.data[i + 2] = rgb[2];
	}
};


// vim: set cin noet ts=8 sw=8:
