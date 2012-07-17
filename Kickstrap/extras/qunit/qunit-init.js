$('body').append('<div id="qunit" class="qunit-floating">QUNIT</div><div id="qunit-fixture""></div>');
QUnit.begin(function() {
	if(typeof window.test == 'function') {
	// function exists, so we can now call it
		$('body').append('<script src="'+rootDir+'Kickstrap/extras/qunit/tests.js"></script>');
	}
	else {
		consoleLog('Could not load tests.');
	}
});
