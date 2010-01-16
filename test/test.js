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


cinejs.test = function (filter) {
	var player = new cinejs.Player({
		source: document.getElementById("source"),
		destination: document.getElementById("destination")
	});

	player.createIntermediateCanvas = function () {
		return document.getElementById("intermediate");
	};

	player.realRender = player.renderFrame;
	var frameCount = 0;
	var start;
	var fps = document.getElementById("fps");
	player.renderFrame = function (video, intermediate, destination) {
		if (frameCount == 0) {
			start = (new Date()).getTime();
		}
		else {
			var now = (new Date()).getTime();
			var elapsed = (now - start) / 1000.0;
			fps.innerHTML = (Math.floor(frameCount / elapsed * 10) / 10) + " FPS";
		}
		frameCount++;

		this.realRender(video, intermediate, destination);
	};

	player.filters.push(filter);

	document.getElementById("play").addEventListener("click", function () {
		frameCount = 0;
		player.play();
		return false;
	}, false);
};


// vim: set cin noet ts=8 sw=8:
