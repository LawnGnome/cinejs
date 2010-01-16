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


window.onload = function () {
	var player = new cinejs.Player({
		source: document.getElementById("source"),
		destination: document.getElementById("destination")
	});

	player.createIntermediateCanvas = function () {
		return document.getElementById("intermediate");
	};

	document.getElementById("filter").onchange = function () {
		var filter = document.getElementById("filter");

		if (filter.value === "BrightnessContrast") {
			player.filters = [new cinejs.filters.BrightnessContrast(0.5, 1.5)];
		}
		else if (filter.value == "ColourLevel") {
			player.filters = [new cinejs.filters.ColourLevel(5.0, 0.0, 0.0)];
		}
		else if (filter.value == "GaussianBlur") {
			player.filters = [new cinejs.filters.GaussianBlur(4)];
		}
		else if (filter.value == "Invert") {
			player.filters = [new cinejs.filters.Invert()];
		}
		else if (filter.value == "Posterise") {
			player.filters = [new cinejs.filters.Posterise(4)];
		}
		else if (filter.value == "HSV") {
			player.filters = [new HSVFilter()];
		}
		else {
			player.filters = [];
		}

		player.play();
		return true;
	};
};


// vim: set cin noet ts=8 sw=8:
