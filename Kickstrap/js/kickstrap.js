// Variables
var rootDir, addOnLocation, customFunction;
var selectorName = 'content';
var poorSoul = false;

// Some functions we'll need later and consistently.

function clearCache() {

	// Let's see if the browser has localStorage so
	// this doesn't blow up.
	var hasStorage = (function() {
    try {
      localStorage.setItem(mod, mod);
      localStorage.removeItem(mod);
      return true;
    } catch(e) {
      return false;
    }
  }());

	if(hasStorage) {localStorage.clear()}; // This is the part that actually clears the cache.
	console.log('Cache has been cleared. Reloading...');
	location.reload(true);
}

function consoleLog(msg, msgType) { 
	if(typeof window.consoleLogger == 'function') {
		consoleLogger(msg, msgType);
	}
}

function stripslashes(str) {
	str = str.replace(/['"]/g,'');
	return str;
}

/* =====================================================
Modified version of CSV splitter thanks to 
http://www.greywyvern.com/?post=258
Apparently this is not very IE compatible. 
http://stackoverflow.com/questions/5053292/javascript-how-to-create-global-functions-variables
======================================================*/

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

/*========================================================
We need to use this hack differently for certain browsers.
Let's see what the user has...
Workaround for IE8 Content bug: 
http://stackoverflow.com/questions/2519640/divmydiv-csscontent-returns-undefined-in-ie8
Test here: 
http://jsfiddle.net/ajkochanowicz/wC5NL/1/ 
======================================================*/

 
/*===================================================================
If we're running IE8, we have to use the fake 'ie8' css property.
IE8 also has compatibility mode, so throw ie7 in there too.
======================================================================*/

var ver = getInternetExplorerVersion();
if ( ver > -1 )
{
  if ( ver <= 8.0 && ver > 6.0) {
    selectorName = 'ie8';
    poorSoul = true;
  }
  else {
    selectorName = 'content';
  }
} 
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
// Those poor souls. Let's move on...

/* ====================================================
The humble Kickstrap jQuery plugin.
=====================================================*/

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
  
/* ====================================================
Now that we're set up there, let's parse the plugins the user
wants. This comes from their settings.less file.
So we'll call appendMagic for the first time, also telling it
the root directory it will be doing all its magic in.
=====================================================*/
  
  appendMagic(rootDir);
 };  
})(jQuery);

function appendMagic(newRootDir, newAppendee) {

/* ====================================================
If we're running this for the first time, let's establish the
full add-on location for linking our fun add-ons.
==================================================== */

		if (newRootDir) {rootDir=newRootDir;} 
		addOnLocation = rootDir + "Kickstrap/extras/";

		if (newAppendee) {
		
		/* ====================================================
		No user defined add-ons here, just standard things like the console
		and caching. Using the css hack again.
		=====================================================*/
		  
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
			document.write(formatAppendee($(newAppendee).css(selectorName)));
			
		}
		else {
			/* ====================================================
			This must mean we're only getting started by hacking the
			script from script#addOns.
			
			Let's make some friends for him.
			=====================================================*/
			
			/* ====================================================
			Almost forgot, IE < 9 doesn't have a console or localStorage. 
			If it did it would just mess this all up anyway, so let's skip it.
			=====================================================*/
			
			if(!poorSoul) {
				document.write('<script id="console" type="text/javascript">appendMagic(null, \'#console\');</script><script id="caching" type="text/javascript">appendMagic(null, \'#caching\');</script>');
			}
		
			/* ====================================================
			And finally we'll pull the script out of script#addOns.
			=====================================================*/
			
			var contentString = stripslashes($('#addOns').css(selectorName));
						
			/* ====================================================
			That comes back as a CSV, so let's make it into an array.
			(Using the function we just defined above)
			=====================================================*/
			
			var addOnArray = contentString.splitCSV();

			 
			/* ====================================================
			Now that that's pure JS, let's loop through it...
			=====================================================*/
			
			for (var i=0;i<addOnArray.length || function(){return false;}();i++) {
				
				/* ====================================================
				By sticking the names into a predefined path beginning with the
				set root path, we know exactly where to get the config.ks file
				where the dependencies are located.
				=====================================================*/
				
				/* ====================================================
				Let's ignore each keyword the user comments out.
				=====================================================*/
				if(addOnArray[i].substr(0, 2) == "//") {
					consoleLog('Ignoring: ' + addOnArray[i].substr(2,(addOnArray[i].length)),'warn');
				}
				else {
					/* ====================================================
					Not commented out? Okay, let's plug it in.
					=====================================================*/
					getKsFile(addOnArray[i]);
				}
			}
		}
		
		/* ====================================================
		Since the keyword and folder name are the same, let's go there
		and see what dependencies the config.ks file wants us to install.
		=====================================================*/
		
	  function getKsFile(pluginName) {
	    consoleLog('Loading add-on ' + pluginName);
	  	if(!(pluginName == "")) { //User may leave a trailing comma
		  	var ksURL = addOnLocation + pluginName + "/config.ks";
				$.ajax({
					type: "GET",
					url: ksURL,
					dataType: "html",
					
					/* ====================================================
					Our AJAX request was successful. Let's do our CSV -> Array 
					fun again in the next function.
					=====================================================*/
					success: function(data) {processKs(data, pluginName);}
				});
			}
	  }

		function processKs(allText, pluginName) {
	    var allTextLines = allText.split(/\r\n|\n/);
	    var headers = allTextLines[0].split(',');
	    var lines = [];
	    
	    // We have an array now, let's break it apart.
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

		/* ====================================================
		Here's the part where we actually start writing the dependencies
		to the DOM.
		=====================================================*/
		
		function pluginDepWriter(configArray, pluginName) {
			// For now, we just look at the first line of this doc.
			configArray = configArray[0];	
			// Split these into either the css or js array.
			for(i = 0; i < configArray.length;i++){ // Run additional user code once finished.
				var depName = String(configArray[i]);
				var depSuffix = depName.substr(depName.length-3, depName.length);
				var depSrc = addOnLocation + pluginName + "/" + depName;
				var bodyElement = document.getElementsByTagName('body')[0];
				switch(depSuffix) {
					case ".js":
						// Should be pretty browser friendly
						// http://unixpapa.com/js/dyna.html
				    var newScript = document.createElement('script');
				    newScript.type = 'text/javascript';
				    newScript.src = depSrc;
				    bodyElement.appendChild(newScript);
					break;
					
					case "css":
					  var linkElement = document.createElement("link");
					  linkElement.setAttribute("rel", "stylesheet");
					  linkElement.setAttribute("type", "text/css");
					  linkElement.setAttribute("href", depSrc);
					  bodyElement.appendChild(linkElement);
					break;
				}
			}
		}
	}

