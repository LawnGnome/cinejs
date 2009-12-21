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
	if (typeof this.options.source === "undefined") {
		throw "A source element or URI must be provided";
	}
	else if (typeof this.options.source === "object") {
		if (!(this.options.source instanceof String || this.options.source instanceof HTMLVideoElement)) {
			throw "The source option must be a string or video element";
		}
	}
	else if (typeof this.options.source !== "string") {
		throw "The source option must be a string or video element";
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
	canvas.width = this.destination.width;
	canvas.height = this.destination.height;

	document.body.appendChild(canvas);

	return canvas;
};

/**
 * Creates a hidden video element for use while playing. This may be overridden
 * should the defaults (append to the end of the document; set the style to
 * display: none) not be acceptable.
 *
 * @param {string} uri The URI to set the element source to.
 * @return {HTMLVideoElement}
 */
cinejs.Player.prototype.createVideoElement = function (uri) {
	var video = document.createElement("video");

	/* There's no need to autoplay, since we're going to start playback in
	 * play() anyway. */
	video.autoplay = false;

	video.autobuffer = true;
	video.src = uri;
	video.style.display = "none";

	/* Theoretically, we could set the width and height of the video
	 * element here. According to the HTML5 draft spec, though,
	 * canvas.drawImage() should ignore those regardless, so we'll leave it
	 * be for now -- the default should be the native size of the video,
	 * which will get rid of any unnecessary scaling overhead. */
	
	document.body.appendChild(video);

	return video;
};

/**
 * Starts playback of the processed video.
 *
 * @throws {string} Throws anything check() can throw.
 */
cinejs.Player.prototype.play = function () {
	this.check();

	// Create a video element, should we need one.
	var video;
	if (typeof this.options.source === "object" && this.options.source instanceof HTMLVideoElement) {
		video = this.options.source;
	}
	else {
		video = this.createVideoElement(this.options.source);
	}

	// We also need an intermediate canvas to do our processing on.
	var intermediate = this.createIntermediateCanvas();

	var self = this;
	video.addEventListener("play", function () {
		self.renderFrame(video, intermediate, self.options.destination);
	});

	video.play();
};

/**
 * Actually renders a frame of the video by rendering it and calling any
 * filters required.
 *
 * @param {HTMLVideoElement} video The source video element.
 * @param {HTMLCanvasElement} intermediate An intermediate canvas to be used
 *                                         for filtering and processing.
 * @param {HTMLCanvasElement} destination The destination canvas.
 */
cinejs.Player.prototype.renderFrame = function (video, intermediate, destination) {
	// If the video's not playing, we have nothing to do.
	if (video.paused || video.ended) {
		return;
	}

	if (this.filters.length === 0) {
		/* Shortcut if we have no filters defined: just splat the data
		 * straight to the destination. */
		var context = destination.getContext("2d");
		context.drawImage(video, 0, 0, destination.width, destination.height);
	}
	else {
		var intermediateContext = intermediate.getContext("2d");
		var destinationContext = destination.getContext("2d");

		/* Put the current video frame onto the intermediate canvas so
		 * we can get its raw image data. */
		intermediateContext.drawImage(video, 0, 0, intermediate.width, intermediate.height);
		var imageData = intermediateContext.getImageData(0, 0, intermediate.width, intermediate.height);

		// Now apply each filter in turn.
		for (var filter in this.filters) {
			if (this.filters.hasOwnProperty(filter)) {
				this.filters[filter].processFrame(imageData);
			}
		}

		// Finally, put the munged frame to the destination canvas.
		destinationContext.putImageData(imageData, 0, 0);
	}

	// Make sure we're called again after the right delay.
	var self = this;
	window.setTimeout(function () {
		self.renderFrame(video, intermediate, destination);
	}, this.options.frameDelay);
};

// vim: set cin noet ts=8 sw=8:
