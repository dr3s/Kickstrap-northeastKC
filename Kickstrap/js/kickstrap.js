	/* 
		document.write(formatAppendee($(newAppendee).css('content')));
		function formatAppendee(str) {
			str=str.replace(/\\'/g,'\'');
			str=str.replace(/\\"/g,'"');
			str=str.replace(/\\0/g,'\0');
			str=str.replace(/\\\\/g,'\\');
			str=str.substring(1,str.length-1);
			return str;
		}
	*/
	
	function appendMagic(rootDir, newAppendee) {
	
		// Variables
		var addOnLocation = "Kickstrap/extras/";
		if (!rootDir) {rootDir="";} // rootDir allows users to refer to js from sub directory html files. Assuming relative path if not specified.
			
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
		
		if (!newAppendee) {
			// Get the formatted content string
			var contentString = stripslashes($('#addOns').css('content'));
			
			var addOnArray = contentString.splitCSV();
			for (i=0;i<addOnArray.length;i++) {
				
				// Open the add-on's config file to see what we need to import.
				getKsFile(addOnArray[i]);
			}
		}
		else {
			document.write(formatAppendee($(newAppendee).css('content')));
			function formatAppendee(str) {
				str=str.replace(/\\'/g,'\'');
				str=str.replace(/\\"/g,'"');
				str=str.replace(/\\0/g,'\0');
				str=str.replace(/\\\\/g,'\\');
				str=str.substring(1,str.length-1);
				return str;
			}
		}
		
		function pluginDepWriter(configArray, pluginName) {
			// We don't need an array in an array.
			configArray = configArray[0];	
			
			// Split these into either the css or js array.
			for (i = 0; i < configArray.length; i++) {
				var depName = String(configArray[i]);
				var depSuffix = depName.substr(depName.length-3, depName.length);
				var depSrc = rootDir + addOnLocation + pluginName + "/" + depName;
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
	
	function clearCache() {
		localStorage.clear() // My name sounds nicer. :)
		console.log('Cache has been cleared. Reloading...');
		location.reload(true);
	}
	
	function consoleLog(msg, msgType) {
		if(typeof window.consoleLogger == 'function') {
			consoleLogger(msg, msgType);
		}
	}

