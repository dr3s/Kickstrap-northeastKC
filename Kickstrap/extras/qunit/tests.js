if(typeof window.myFunction == 'test') {
// function exists, so we can now call it
	function beginTest() {
	  // Write your tests here to prevent them from loading before QUnit does.
		test("a basic unit test", function() {var value="hello";equal(value,"hello","We expect value to be hello");});
		
	};
}


