/* ini_optimize.js
 *
 * Work as a command line process to optimize a bulky, 
 * yet difficult to find duplicated entries, ini file.
 *
 * This is originally created for optimizing the sybase 
 * ini which had been sharing across my team for years.
 *
 * If you think of any feature suggestions, feel free 
 * to let me know on github.
 *
 * @author Vicary Archangel
 */

;(function() {

// Remove "node" and "ini_optimize.js".
var argv = process.argv.slice(2);

if (argv.length == 0) {
	console.log("Usage: node ini_optimize.js input_path[, output_path]");
	
	return;
}

var fs = require('fs');

fs.readFile(argv[0], 'utf8', 
	function (err, data) {
		if (err) {
			throw err;
		}
		
		var cache = {}, 					// Object to hold the whole ini file structure.
			currentIndex = '',  			// Cache of tag names.
			reqex = /^\s*\[([^\]]+)\]\s*$/, // Matcher for [...] tags. 
			lines = data.split(/\r?\n/);	// Universal line splitter.
		
		var n = lines.length;
		for (var i=0; i<n; i++) {
			var line = lines[i].trim();
			
			if (!line||line[0] == ';') {
				continue;
			}
			
			var matches = reqex.exec( line );
			if (matches !== null) {
				if (!cache.hasOwnProperty( matches[1] )) {
					currentIndex = matches[1];
					cache[currentIndex] = {};
				}
			}
			else if (currentIndex) {
				var info = line.split( '=' );
				if (info.length != 2) {
					console.log( 'Invalid property type at line ' + i + ':\n' + info );
				}
				else {
					cache[currentIndex][info[0]] = info[1].replace( /,\s*/g, ',' );
				}
			}
		}
		
		// Get all keys
		var result = []; for (var i in cache) result.push( i );
		
		// Sort the keys alphabetically
		result.sort();
		
		// Composite result in text format.
		var n = result.length;
		for (var i=0; i<n; i++) {
			var item = cache[result[i]];
			var text = '';
			for (var key in item) {
				text += key + '=' + item[key] + '\n';
			}
			
			result[i] = '\n[' + result[i] + ']\n' + text;
		}
		
		// Write to output file.
		fs.writeFile(argv[1] || 'result.txt', 
			result.join(''), 'utf8', 
			function (err) {
				if ( err ) {
			  		throw ( err );
				}
				else {
			  		console.log( 'File saved.' );
				}
			});
	});

})();