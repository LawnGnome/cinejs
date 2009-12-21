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
 * Constructs a brightness and contrast filter.
 *
 * @class A brightness and contrast filter.
 * @param {number} brightness A multiplier for the brightness between -1 and 1.
 * @param {number} contrast Contrast multiplier. Low values (0 to 1) will
 *                          result in low contrast, high values (1 to infinity)
 *                          higher contrast. It's probably easiest just to play
 *                          with it.
 */
cinejs.filters.BrightnessContrast = function (brightness, contrast) {
	this.brightness = brightness;
	this.contrast = contrast;
};

/**
 * The main processing function for the brightness and contrast filter.
 *
 * @param {ImageData} frame
 */
cinejs.filters.BrightnessContrast.prototype.processFrame = function (frame) {
	for (var i = 0; i < frame.data.length; i += 4) {
		frame.data[i + 0] = this.processSubpixel(frame.data[i + 0]);
		frame.data[i + 1] = this.processSubpixel(frame.data[i + 1]);
		frame.data[i + 2] = this.processSubpixel(frame.data[i + 2]);
	}
};

/**
 * The processing function applied to the individual red, green and blue
 * subpixels within a frame.
 *
 * @param {number} subpixel
 * @return {number}
 */
cinejs.filters.BrightnessContrast.prototype.processSubpixel = function (subpixel) {
	// Contrast adjustment.
	if (this.contrast != 1) {
		subpixel -= 128;
		subpixel *= this.contrast;
		subpixel += 128;
	}

	// Brightness adjustment.
	subpixel += (255 * this.brightness);

	// Constrain to valid values.
	return Math.min(255, Math.max(0, subpixel));
};


// vim: set cin noet ts=8 sw=8:
