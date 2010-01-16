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


var player = null;


var addBrightnessContrast = function () {
	var brightness = new Number(document.getElementById("brightness").value);
	var contrast = new Number(document.getElementById("contrast").value);

	var name = "Brightness: " + brightness.toString() + "; Contrast: " + contrast.toString();

	addFilter(name, new cinejs.filters.BrightnessContrast(brightness, contrast));

	hideOverlay();
	document.getElementById("BrightnessContrast-options").reset();

	return false;
};


var addColourLevel = function () {
	var red = new Number(document.getElementById("level-red").value);
	var green = new Number(document.getElementById("level-green").value);
	var blue = new Number(document.getElementById("level-blue").value);

	var name = "Colour Level: " + red.toString() + ", " + green.toString() + ", " + blue.toString();

	addFilter(name, new cinejs.filters.ColourLevel(red, green, blue));

	hideOverlay();
	document.getElementById("ColourLevel-options").reset();

	return false;
};


var addGaussianBlur = function () {
	var radius = new Number(document.getElementById("radius").value);
	var sigma = new Number(document.getElementById("sigma").value);

	var name = "Gaussian Blur: radius " + radius.toString() + "; sigma: " + sigma.toString();

	addFilter(name, new cinejs.filters.GaussianBlur(radius, sigma));

	hideOverlay();
	document.getElementById("GaussianBlur-options").reset();

	return false;
};


var addPosterise = function () {
	var levels = new Number(document.getElementById("levels").value);

	var name = "Posterise: " + levels.toString() + " levels";

	addFilter(name, new cinejs.filters.Posterise(levels));

	hideOverlay();
	document.getElementById("Posterise-options").reset();

	return false;
};


var addSmooth = function () {
	var weight = new Number(document.getElementById("smooth-weight").value);

	var name = "Smooth: weight " + weight.toString();

	addFilter(name, new cinejs.filters.Smooth(weight));

	hideOverlay();
	document.getElementById("Smooth-options").reset();

	return false;
};


var addEdgeDetect = function () {
	addFilter("Edge Detection", new cinejs.filters.EdgeDetect());

	return false;
};


var addEmboss = function () {
	addFilter("Emboss", new cinejs.filters.Emboss());

	return false;
};


var addGreyscale = function () {
	addFilter("Greyscale Colours", new cinejs.filters.Greyscale());

	return false;
};


var addInvert = function () {
	addFilter("Invert Colours", new cinejs.filters.Invert());

	return false;
};


var addFilter = function (name, filter) {
	player.filters.push(filter);

	var container = document.querySelectorAll("#stack > ul")[0];

	var item = document.createElement("li");
	item.textContent = name;

	var remove = document.createElement("a");
	remove.className = "remove";
	remove.href = "#";
	remove.innerHTML = "&#xd7;";
	item.appendChild(remove);
	
	container.appendChild(item);

	remove.onclick = function () {
		for (var i in player.filters) {
			if (player.filters.hasOwnProperty(i)) {
				if (player.filters[i] === filter) {
					delete player.filters[i];
				}
			}
		}

		container.removeChild(item);

		return false;
	};
};


var createPlayer = function () {
	var player = new cinejs.Player({
		source: document.getElementById("source"),
		destination: document.getElementById("destination")
	});

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
			fps.textContent = (Math.floor(frameCount / elapsed * 10) / 10);
		}
		frameCount++;

		this.realRender(video, intermediate, destination);
	};

	return player;
};


var hideOverlay = function () {
	var overlays = document.querySelectorAll(".overlaid");

	for (var i in overlays) {
		if (overlays.hasOwnProperty(i) && overlays[i].style) {
			overlays[i].style.display = "none";
		}
	}

	document.getElementById("overlay").style.display = "none";

	return false;
};


var onPlay = function () {
	var play = document.getElementById("play");
	var source = document.getElementById("source");

	if (source.paused || source.ended) {
		play.textContent = "Stop";
		player.play();
	}
	else {
		play.textContent = "Play";
		player = createPlayer();
		source.pause();
		source.position = 0;
	}

	return false;
};


var showOverlay = function (id) {
	document.getElementById("overlay").style.display = "block";

	var overlays = document.querySelectorAll(".overlaid");

	for (var i in overlays) {
		if (overlays.hasOwnProperty(i) && overlays[i].style) {
			if (overlays[i].id === id) {
				overlays[i].style.display = "block";
			}
			else {
				overlays[i].style.display = "none";
			}
		}
	}

	return false;
};


window.onload = function () {
	player = createPlayer();

	document.getElementById("BrightnessContrast").onclick = function () { showOverlay("BrightnessContrast-options"); return false; };
	document.getElementById("ColourLevel").onclick = function () { showOverlay("ColourLevel-options"); return false; };
	document.getElementById("EdgeDetect").onclick = addEdgeDetect;
	document.getElementById("Emboss").onclick = addEmboss;
	document.getElementById("GaussianBlur").onclick = function () { showOverlay("GaussianBlur-options"); return false; };
	document.getElementById("Greyscale").onclick = addGreyscale;
	document.getElementById("Invert").onclick = addInvert;
	document.getElementById("Posterise").onclick = function () { showOverlay("Posterise-options"); return false; };
	document.getElementById("Smooth").onclick = function () { showOverlay("Smooth-options"); return false; };

	document.getElementById("BrightnessContrast-options").onsubmit = addBrightnessContrast;
	document.getElementById("ColourLevel-options").onsubmit = addColourLevel;
	document.getElementById("GaussianBlur-options").onsubmit = addGaussianBlur;
	document.getElementById("Posterise-options").onsubmit = addPosterise;
	document.getElementById("Smooth-options").onsubmit = addSmooth;

	document.getElementById("play").onclick = onPlay;

	document.getElementById("overlay").onclick = hideOverlay;
};


// vim: set cin noet ts=8 sw=8:
