var FileContainer,
	readFiles, readSingleFile,

	fs = require('fs'),
	path = require('path');

/**
 * Private class, returned on calling readFiles. Used make accessing files
 * more straightforward.
 * 
 * @param {Array} fileNames    An array of string file names
 * @param {Array} fileContents An array of string file contents - must be same order as fileNames.
 */
FileContainer = function (fileNames, fileContents) {
	if (!(this instanceof FileContainer)) {
		return new FileContainer();
	}

	this.fileNames = fileNames || [];
	this.fileContents = fileContents || [];
};

/**
 * Iterate over all of the files.
 */
FileContainer.prototype.each = function(callback) {
	var i, l = this.fileNames.length;

	for (i = 0; i < l; i += 1) {
		callback(this.fileContents[i], this.fileNames[i]);
	}
};


/**
 * The function exposed on calling require
 * 
 * Reads multiple files and returns an instance for working with their contents.
 * 
 * @param {Array}    files The files to parse.
 * @param {Function} callback Callback to use when finished.
 */
readFiles = function(files, callback) {
	var names = [],
		contents = [],
		errors = [],
		completeCount = 0,
		i, l = files.length;

	for (i = 0; i < l; i += 1) {
		readSingleFile(files[i], i, function(err, index, fileContents) {
			completeCount += 1;

			if (err) {
				errors.push(err);
			} else {
				names[index] = path.basename(files[index]);
				contents[index]  = fileContents;
			}

			if (completeCount === l) {
				if (errors.length) {
					return callback(errors[0]);
				}
				callback(false, new FileContainer(names, contents));
			}
		});
	}
};

/**
 * Method called from within `readFiles` to handle an individual file.
 * 
 * Avoids issues with the iteration index changing before the file is loaded.
 * 
 * @param  {String}   file     The name of the file to read.
 * @param  {Number}   index    The index of the file in its original array, for keeping things in order.
 * @param  {Function} callback Callback to use when the file is loaded.
 */
readSingleFile = function(file, index, callback) {
	fs.readFile(path.resolve(file), function(err, contents) {
		if (err) {
			return callback(err);
		}
		callback(false, index, contents);
	});
};

module.exports = readFiles;