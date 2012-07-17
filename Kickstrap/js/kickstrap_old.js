// Allow the user to change the root directory to automatically fix the directory of all their plugins.
var rootDir, addOnLocation, customFunction;
var selectorName = 'content';

// Workaround for IE8 Content bug http://stackoverflow.com/questions/2519640/divmydiv-csscontent-returns-undefined-in-ie8
// Test here: http://jsfiddle.net/ajkochanowicz/wC5NL/1/
checkVersion();      
function getInternetExplorerVersion() {
  var rv = -1; // Return value assumes failure.
  if (navigator.appName == 'Microsoft Internet Explorer')
  {
    var ua = navigator.userAgent;
    var re  = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");
    if (re.exec(ua) != null)
      rv = parseFloat( RegExp.$1 );
  }
  return rv;
}
// If we're running IE8, we should look for the fake 'ie8' css property.
function checkVersion() {
  var ver = getInternetExplorerVersion();
  if ( ver > -1 )
  {
    if ( ver <= 8.0 && ver > 7.0) 
      selectorName = 'ie8'
    else
      selectorName = 'content';
  }

	/*$('script').each(function() {
		this.setAttribute("style","ie8: 'blah'");
	});*/

}

	(function($){  
	 $.kickstrap = function(options) { 
	 
		var defaults = {  
			kickstrapIsHere: "/",
			thisFileIsHere: "/",
			customJS: function(){}
	  };  
	  var options = $.extend(defaults, options); 
	  var rootDir = options.kickstrapIsHere;
	  customFunction = options.customJS;
	  appendMagic(rootDir);
	 };  
	})(jQuery);
	
	function clearCache() {
		localStorage.clear() // This is the part that actually clears the cache.
		console.log('Cache has been cleared. Reloading...');
		location.reload(true);
	}
	
	function consoleLog(msg, msgType) { 
		if(typeof window.consoleLogger == 'function') {
			consoleLogger(msg, msgType);
		}
	}

	function appendMagic(newRootDir, newAppendee) {
	
		// Variables
		
		if (newRootDir) {rootDir=newRootDir;} // rootDir allows users to refer to js from sub directory html files. Assuming relative path if not specified.
		addOnLocation = rootDir + "Kickstrap/extras/";
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
	  	  //consoleLog('Loading add-on "' + pluginName + '"');
		  	var ksURL = addOnLocation + pluginName + "/config.ks";
				alert(ksURL);
				$.ajax({
					type: "GET",
					url: ksURL,
					dataType: "html",
					success: function(data) {alert(data);processKs(data, pluginName);}
				});
			}
	  }
		// Modified version of CSV splitter thanks to http://www.greywyvern.com/?post=258
		// Apparently this is not very IE compatible. http://stackoverflow.com/questions/5053292/javascript-how-to-create-global-functions-variables
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
		
			// Write the appendMagic script elements for console, console tools, etc.
			document.write('<script id="console" type="text/javascript">appendMagic(null, \'#console\');</script><script id="caching" type="text/javascript">appendMagic(null, \'#caching\');</script>');
		
			// Get the formatted content string
			var contentString = stripslashes($('#addOns').css(selectorName));
			
			 var addOnArray = contentString.splitCSV();
			// Once all the addOns are loaded, fire the user's handmade javascript from $.kickstrap.
			for (var i=0;i<addOnArray.length || function(){return false;}();i++) {
				
				// Open the add-on's config file to see what we need to import.
				// But first make sure it's not commented out.
				if(addOnArray[i].substr(0, 2) == "//") {
					consoleLog('Ignoring: ' + addOnArray[i].substr(2,(addOnArray[i].length)),'warn');
				}
				else {
				  alert(addOnArray[i]);
					getKsFile(addOnArray[i]);
				}
			}
			
		}
		else {
		  
			function formatAppendee(str) {
			  str = String(str);
			  //alert(str);
				str=str.replace(/\\'/g,'\'');
				str=str.replace(/\\"/g,'"');
				str=str.replace(/\\0/g,'\0');
				str=str.replace(/\\\\/g,'\\');
				str=str.substring(1,str.length-1);
				return str;
			}
			//alert(formatAppendee($(newAppendee).css(selectorName)));
			document.write(formatAppendee($(newAppendee).css(selectorName)));
		}
		
		function loadScript(url, callback) {
		   // adding the script tag to the head as suggested before
		   var head = document.getElementsByTagName('body')[0];
		   var theScript = document.createElement('script');
		   theScript.type = 'text/javascript';
		   theScript.src = url;
		
		   // then bind the event to the callback function 
		   // there are several events for cross browser compatibility
		   theScript.onreadystatechange = callback; // This is unnecessary in Chrome, causing problems in IE.
		   theScript.onload = callback;
		
		   // fire the loading
		   head.appendChild(theScript);
		};
		
		function pluginDepWriter(configArray, pluginName) {
			// We don't need an array in an array.
			configArray = configArray[0];	
		
			
			// Split these into either the css or js array.
			for(i = 0; i < configArray.length;i++){ // Run additional user code once finished.
				var depName = String(configArray[i]);
				var depSuffix = depName.substr(depName.length-3, depName.length);
				var depSrc = addOnLocation + pluginName + "/" + depName;

				switch(depSuffix) {
					case ".js":
					loadScript(depSrc);
					break;
					
					case "css":
					$('head').append('<link type="text/css" rel="stylesheet" href="'+ depSrc +'" />');
					break;
				}

			}
			
		}
		
		/*(function($){  
		 $.kickstrap = function(f,i) { // f = function, i = initiate 
		 	$(window).load(function() {
 				var customFunction = f;
 				f(); 
		 	}); 
		 };  
		})(jQuery);*/
	}

