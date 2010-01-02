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
 * Constructs a posterisation filter.
 *
 * @class A simple posterisation filter.
 * @param {number} levels The number of levels to output.
 */
cinejs.filters.Posterise = function (levels) {
	this.divisor = 256 / Math.floor(levels);
};

/**
 * The processing function for the posterisation filter.
 *
 * @param {ImageData} frame
 * @param {HTMLCanvasElement} canvas
 */
cinejs.filters.Posterise.prototype.processFrame = function (frame, canvas) {
	for (var i = 0; i < frame.data.length; i += 4) {
		/* We'll use round rather than floor to try to keep the overall
		 * image brightness roughly the same. */
		frame.data[i + 0] = this.divisor * Math.round(frame.data[i + 0] / this.divisor);
		frame.data[i + 1] = this.divisor * Math.round(frame.data[i + 1] / this.divisor);
		frame.data[i + 2] = this.divisor * Math.round(frame.data[i + 2] / this.divisor);
	}
};


// vim: set cin noet ts=8 sw=8:
