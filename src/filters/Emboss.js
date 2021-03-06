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
 * Constructs an embossing filter.
 *
 * @class An embossing filter.
 */
cinejs.filters.Emboss = function () {
	this.filter = [
		[1.5, 0.0, 0.0],
		[0.0, 0.0, 0.0],
		[0.0, 0.0, -1.5]
	];
};

/**
 * The processing function for the embossing filter.
 *
 * This is based on gdImageEmboss() by Pierre Joye.
 *
 * @param {ImageData} frame
 * @param {HTMLCanvasElement} canvas
 */
cinejs.filters.Emboss.prototype.processFrame = function (frame, canvas) {
	cinejs.util.applyConvolution(frame, canvas.width, canvas.height, this.filter, 1, 127);
};


// vim: set cin noet ts=8 sw=8:
