function appendMagic() {

	// Variables
	var addOnLocation = "js/";
		
	// Functions we'll need later
	function stripslashes(str) {
		str = str.replace(/['"]/g,'');
		return str;
	}
	function processKs(allText, pluginName) {
    var allTextLines = allText.split(/\r\n|\n/);
    var headers = allTextLines[0].split(',');
    var lines = [];

    for (var i=0; i<allTextLines.length; i++) {
        var data = allTextLines[i].split(',');
        if (data.length == headers.length) {

            var tarr = [];
            for (var j=0; j<headers.length; j++) {
                tarr.push(data[j]);
            }
            lines.push(tarr);
        }
    }
    pluginDepWriter(lines, pluginName);
	}
  function getKsFile(pluginName) {
  	if(!(pluginName == "")) { //User may leave a trailing comma
	  	var ksURL = addOnLocation + pluginName + "/config.ks";
			$.ajax({
				type: "GET",
				url: ksURL,
				dataType: "text",
				success: function(data) {processKs(data, pluginName);}
			});
		}
  }
	// Modified version of CSV splitter thanks to http://www.greywyvern.com/?post=258
	String.prototype.splitCSV = function(sep) {
	  for (var foo = this.split(sep = sep || ","), x = foo.length - 1, tl; x >= 0; x--) {
	  	foo[x] = foo[x].replace(/ /g,''); // Modified to remove spaces from string too.
		    if (foo[x].replace(/"\s+$/, '"').charAt(foo[x].length - 1) == '"') {
		      if ((tl = foo[x].replace(/^\s+"/, '"')).length > 1 && tl.charAt(0) == '"') {
		        foo[x] = foo[x].replace(/^\s*"|"\s*$/g, '').replace(/""/g, '"');
		      } else if (x) {
		        foo.splice(x - 1, 2, [foo[x - 1], foo[x]].join(sep));
		      } else foo = foo.shift().split(sep).concat(foo);
		    } else foo[x].replace(/""/g, '"');
	  } return foo;
	};
	
	// Get the formatted content string
	var contentString = stripslashes($('#addOns').css('content'));
	console.log(contentString);
	
	var addOnArray = contentString.splitCSV();
	console.log(addOnArray);
	for (i=0;i<addOnArray.length;i++) {
		console.log('Item #'+i+' is '+addOnArray[i]);
		
		// Open the add-on's config file to see what we need to import.
		getKsFile(addOnArray[i]);
	}
	
	function pluginDepWriter(configArray, pluginName) {
		// We don't need an array in an array.
		configArray = configArray[0];	
		
		// Split these into either the css or js array.
		for (i = 0; i < configArray.length; i++) {
			var depName = String(configArray[i]);
			var depSuffix = depName.substr(depName.length-3, depName.length);
			var depSrc = addOnLocation + pluginName + "/" + depName;
			switch(depSuffix) {
				case ".js":
				$('body').append('<script type="text/javascript" src="' + depSrc + '"></script>');
				break;
				
				case "css":
				$('head').append('<link type="text/css" rel="stylesheet" href="'+ depSrc +'" />');
				break;
			}
		}
	}
	
}