window.onload = function () {
	var player = new cinejs.Player({
		source: document.getElementById("source"),
		destination: document.getElementById("destination")
	});

	player.createIntermediateCanvas = function () {
		return document.getElementById("intermediate");
	};

	document.getElementById("filter").addEventListener("change", function (e) {
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
	}, false);
};

// vim: set cin noet ts=8 sw=8:
