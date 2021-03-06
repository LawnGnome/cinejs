JSLINT=jslint
JSMIN=jsmin

all:	dist/cine.js dist/cine.js.gz dist/cine.min.js dist/cine.min.js.gz

clean:
	rm -rf dist

lint:	dist/cine.js
	$(JSLINT) $<

dist:
	test -d dist || mkdir dist

dist/cine.js:	src/cinejs.js src/util.js src/Player.js src/filters/BrightnessContrast.js src/filters/ColourLevel.js src/filters/EdgeDetect.js src/filters/Emboss.js src/filters/GaussianBlur.js src/filters/Greyscale.js src/filters/Invert.js src/filters/Posterise.js src/filters/Smooth.js | dist
	cat $^ > $@

dist/cine.js.gz:	dist/cine.js
	gzip -c $< > $@

dist/cine.min.js:	dist/cine.js
	@if (which $(JSMIN) > /dev/null); \
	then echo '$(JSMIN) < $< > $@'; \
	($(JSMIN) < $< > $@); \
	else echo; \
	echo 'JSMin not found. This is not an error, but will prevent minified versions of'; \
	echo 'CineJS from being generated.'; \
	echo; \
	fi

dist/cine.min.js.gz:	dist/cine.min.js
	@if (which $(JSMIN) > /dev/null); \
	then echo 'gzip -c $< > $@'; \
	(gzip -c $< > $@); \
	fi

# vim: set nocin noet ts=8 sw=8:
