/* trim_ini.js
 *
 * '/sybase/ini/sql.ini'
 *
 * @author Vicary Archangel
 */

;(function() {

var argv = process.argv;

if (argv[0] == 'node') {
	argv.shift();
}

argv.shift();

if (argv.length == 0) {
	console.log("Usage: node trim_ini.js input_path[ output_path]");
	
	return;
}

var fs = require('fs');

fs.readFile(argv[0], 'utf8', 
function (err, data) {
	if (err) throw err;
	
	var cache = {},
		currentIndex = '',
		reqex = /^\s*\[([^\]]+)\]\s*$/,
		lines = data.split(/\r?\n/);
	
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
	var result = []; for (var i in cache) result.push(i);
	
	// Sort the keys
	result.sort();
	
	var n = result.length;
	for (var i=0; i<n; i++) {
		var item = cache[result[i]];
		var text = '';
		for (var k in item) {
			text += k + '=' + item[k] + '\n';
		}
		
		result[i] = '\n[' + result[i] + ']\n' + text;
	}
	
	fs.writeFile(argv[1] || 'result.txt', result.join(''), 'utf8', 
	function (err) {
		if (err) throw (err);
		else console.log('File saved.');
	});
});

})();