var HSVFilter = function () {
};


HSVFilter.prototype.processFrame = function (frame, canvas) {
	for (var i = 0; i < frame.data.length; i += 4) {
		var hsv = cinejs.util.rgbToHsv(frame.data[i + 0], frame.data[i + 1], frame.data[i + 2]);
		var rgb = cinejs.util.hsvToRgb(hsv[0], hsv[1], hsv[2]);
		frame.data[i + 0] = rgb[0];
		frame.data[i + 1] = rgb[1];
		frame.data[i + 2] = rgb[2];
	}
};


// vim: set cin noet ts=8 sw=8:
