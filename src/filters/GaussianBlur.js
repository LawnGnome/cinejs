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
 * Constructs a Gaussian blur filter.
 *
 * @class A Gaussian blur filter.
 * @param {number} radius The radius for the blur, in pixels.
 * @param {number} sigma The sigma for the Gaussian kernel; 0.8 if omitted.
 */
cinejs.filters.GaussianBlur = function (radius, sigma) {
	if (!sigma) {
		/* Arbitrarily chosen default σ value based upon Wikipedia and
		 * guesswork. (My favourite kind of maths: the type that
		 * doesn't involve me thinking for myself.) */
		sigma = 0.8;
	}

	this.radius = radius;
	this.kernel = this.calculateKernel(radius, sigma);
};

/**
 * The main processing function for the brightness and contrast filter.
 *
 * @param {ImageData} frame
 * @param {HTMLCanvasElement} canvas
 */
cinejs.filters.GaussianBlur.prototype.processFrame = function (frame, canvas) {
	var i = 0;
	var j = 0;
	var red;
	var green;
	var blue;
	var ki;
	var fi;
	var fcol;
	var frow;
	var row;
	var col;

	// Column-wise blurring.
	for (row = 0; row < canvas.height; row++) {
		for (col = 0; col < canvas.width; col++) {
			i = 4 * (row * canvas.width + col);
			ki = 0;
			red = green = blue = 0.0;
			for (fi = -this.radius; fi <= this.radius; fi++) {
				fcol = col + fi;

				if (fcol < 0) {
					fcol = 0;
				}
				else if (fcol > canvas.width) {
					fcol = canvas.width - 1;
				}

				j = 4 * (row * canvas.width + fcol);

				red += this.kernel[ki] * frame.data[j + 0];
				green += this.kernel[ki] * frame.data[j + 1];
				blue += this.kernel[ki] * frame.data[j + 2];

				++ki;
			}

			frame.data[i + 0] = red;
			frame.data[i + 1] = green;
			frame.data[i + 2] = blue;
		}
	}

	// Row-wise blurring.
	for (row = 0; row < canvas.height; row++) {
		for (col = 0; col < canvas.width; col++) {
			i = 4 * (row * canvas.width + col);
			ki = 0;
			red = green = blue = 0.0;
			for (fi = -this.radius; fi <= this.radius; fi++) {
				frow = row + fi;

				if (frow < 0) {
					frow = 0;
				}
				else if (frow >= canvas.height) {
					frow = canvas.height - 1;
				}

				j = 4 * (frow * canvas.width + col);

				red += this.kernel[ki] * frame.data[j + 0];
				green += this.kernel[ki] * frame.data[j + 1];
				blue += this.kernel[ki] * frame.data[j + 2];

				++ki;
			}

			frame.data[i + 0] = red;
			frame.data[i + 1] = green;
			frame.data[i + 2] = blue;
		}
	}
};

/**
 * Calculates a one-dimensional convolution kernel for a Gaussian blur.
 *
 * @param {number} radius The radius for the blur, in pixels.
 * @param {number} sigma The sigma for the Gaussian kernel.
 * @return {Array} The one-dimensional kernel as a set of multiplicands.
 */
cinejs.filters.GaussianBlur.prototype.calculateKernel = function (radius, sigma) {
	var kernel = [];
	var i = 0;

	// Calculate one side of the kernel.
	for (i = 0; i <= radius; i++) {
		kernel.push(Math.pow((1.0 / (sigma * Math.sqrt(2.0 * Math.PI))) * Math.E, -(Math.pow(radius - i, 2) / (2.0 * sigma * sigma))));
	}

	// Repeat the values on the other side of the centre point.
	for (i = radius - 1; i >= 0; i--) {
		kernel.push(kernel[i]);
	}

	/* Scale the kernel down so values can be cleanly multiplied without
	 * affecting the overall brightness or saturation. */
	var sum = 0.0;
	for (i = 0; i < kernel.length; i++) {
		sum += kernel[i];
	}
	for (i = 0; i < kernel.length; i++) {
		kernel[i] /= sum;
	}

	return kernel;
};


// vim: set cin noet ts=8 sw=8:
