/**
 * I run the test suite
 */
define('streamhub-isotope-tests', function(require) {
	var jasmine = require('jasmine-html'),
		jasminejQuery = require('jasmine-jquery'),
		$ = require('jquery');

	// Test!
	var jasmineEnv = jasmine.getEnv();
	jasmineEnv.updateInterval = 1000;

	var htmlReporter = new jasmine.HtmlReporter();

	jasmineEnv.addReporter(htmlReporter);

	jasmineEnv.specFilter = function(spec) {
		return htmlReporter.specFilter(spec);
	};

	var specs = [];
	specs.push('tests/spec/tests');
	specs.push('tests/spec/IsotopeView');

	$(function(){
		require(specs, function(){
			jasmineEnv.execute();
		});
	});
});