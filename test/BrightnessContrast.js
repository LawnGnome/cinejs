window.onload = function () {
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

	player.filters.push(new cinejs.filters.BrightnessContrast(0.5, 1.5));

	document.getElementById("play").addEventListener("click", function () {
		frameCount = 0;
		player.play();
		return false;
	}, false);
};

// vim: set cin noet ts=8 sw=8:
