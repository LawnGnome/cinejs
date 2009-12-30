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
 * Creates a new Player object.
 *
 * @class Represents a chain of elements that result in a video being played.
 * @param {object} options Options to be set within the player.
 */
cinejs.Player = function (options) {
	// Initialise the filter chain.
	this.filters = [];

	// Set default options.
	this.options = {
		frameDelay: 25
	};

	// Copy in our provided options.
	for (var option in options) {
		if (options.hasOwnProperty(option)) {
			this.options[option] = options[option];
		}
	}
};

/**
 * Pre-flight check for the player to make sure that all required options are
 * set correctly.
 *
 * @throws {string} A string describing the problem found.
 */
cinejs.Player.prototype.check = function () {
	// Check for a valid source.
	if (!(this.options.source instanceof HTMLVideoElement || this.options.source instanceof HTMLImageElement)) {
		throw "The source option must be a video or image element";
	}

	// Check for a valid destination element.
	if (!this.options.destination instanceof HTMLCanvasElement) {
		throw "The destination option must be a canvas element";
	}

	// Simpler checks for other options.
	if (typeof this.options.frameDelay !== "number" || this.options.frameDelay < 0) {
		throw "The frame delay must be a non-negative number";
	}

	// Check any and all defined filters.
	for (var i in this.filters) {
		if (this.filters.hasOwnProperty(i)) {
			var filter = this.filters[i];

			if (typeof filter.processFrame !== "function") {
				var name = "unknown";

				if (filter.name) {
					name = filter.name;
				}

				throw "Filter " + name + " does not have a processFrame method";
			}
		}
	}
};

/**
 * Creates a hidden canvas for our intermediate video processing. While there's
 * no technical reason we can't just work off the destination canvas, this is
 * likely to result in unsightly video artifacts as processing occurs. This may
 * be overridden should the defaults not suffice (for example, if you want to
 * write a demonstration page that shows the intermediate canvas).
 *
 * @return {HTMLCanvasElement}
 */
cinejs.Player.prototype.createIntermediateCanvas = function () {
	var canvas = document.createElement("canvas");

	canvas.style.display = "none";

	// Grab the destination size as our intermediate size.
	canvas.width = this.options.destination.width;
	canvas.height = this.options.destination.height;

	document.body.appendChild(canvas);

	return canvas;
};

/**
 * Starts playback of the processed video.
 *
 * @throws {string} Throws anything check() can throw.
 */
cinejs.Player.prototype.play = function () {
	this.check();

	// We need an intermediate canvas to do our processing on.
	var intermediate = this.createIntermediateCanvas();
	if (!intermediate instanceof HTMLCanvasElement) {
		throw "Intermediate canvas is not a canvas";
	}

	var self = this;
	if (this.options.source instanceof HTMLVideoElement) {
		this.options.source.addEventListener("play", function () {
			self.renderFrame(self.options.source, intermediate, self.options.destination);
		}, false);

		this.options.source.play();
	}
	else {
		self.renderFrame(self.options.source, intermediate, self.options.destination);
	}
};

/**
 * Actually renders a frame of the video by rendering it and calling any
 * filters required.
 *
 * @param {HTMLImageElement|HTMLVideoElement} source The source video element.
 * @param {HTMLCanvasElement} intermediate An intermediate canvas to be used
 *                                         for filtering and processing.
 * @param {HTMLCanvasElement} destination The destination canvas.
 */
cinejs.Player.prototype.renderFrame = function (source, intermediate, destination) {
	if (this.filters.length === 0) {
		/* Shortcut if we have no filters defined: just splat the data
		 * straight to the destination. */
		var context = destination.getContext("2d");
		context.drawImage(source, 0, 0, destination.width, destination.height);
	}
	else {
		var intermediateContext = intermediate.getContext("2d");
		var destinationContext = destination.getContext("2d");

		/* Put the current source frame onto the intermediate canvas so
		 * we can get its raw image data. */
		intermediateContext.drawImage(source, 0, 0, intermediate.width, intermediate.height);
		var imageData = intermediateContext.getImageData(0, 0, intermediate.width, intermediate.height);

		// Now apply each filter in turn.
		for (var filter in this.filters) {
			if (this.filters.hasOwnProperty(filter)) {
				this.filters[filter].processFrame(imageData, intermediate);
			}
		}

		// Finally, put the munged frame to the destination canvas.
		destinationContext.putImageData(imageData, 0, 0);

		imageData = null;
	}

	/* Make sure we're called again after the right delay, unless the source
	 * has already been stopped. */
	if (source instanceof HTMLVideoElement && !(source.paused || source.ended)) {
		var self = this;
		window.setTimeout(function () {
			self.renderFrame(source, intermediate, destination);
		}, this.options.frameDelay);
	}
};

// vim: set cin noet ts=8 sw=8:
