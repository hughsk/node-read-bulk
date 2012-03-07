var bulk = require('../index.js'),
	assert = require('assert'),
	files = [
		__dirname + '/fixtures/file01.txt',
		__dirname + '/fixtures/file02.txt',
		__dirname + '/fixtures/file03.txt',
		__dirname + '/fixtures/file04.txt'
	];

suite('read-bulk', function() {
	test("Don't return an error when pointed at readable files", function(done) {
		bulk(files, function(err, results) {
			assert.ifError(err);
			done();
		});
	});
	test("Return an error when pointed at the wrong files", function(done) {
		bulk([__dirname + '/fixtures/wrong-file.txt'], function(err, results) {
			assert.ok(err);
			assert.ok(err instanceof Error);
			done();
		});
	});
	test("Returns the expected amount of files", function(done) {
		bulk(files, function(err, results) {
			assert.ifError(err);
			assert.equal(results.fileNames.length, files.length);
			done();
		});
	});
	suite('#each', function() {
		test("Loops the correct amount of times", function(done) {
			bulk(files, function(err, results) {
				var count = 0;
				assert.ifError(err);
				
				results.each(function(contents, name) {
					count += 1;
				});

				assert.equal(count, files.length);
				done();
			});
		});

		test("Loops in the correct order", function(done) {
			bulk(files, function(err, results) {
				var count = 0;
				assert.ifError(err);
				
				results.each(function(contents, name) {
					count += 1;
					switch (count) {
						case 1: assert.equal(name, 'file01.txt'); break;
						case 2: assert.equal(name, 'file02.txt'); break;
						case 3: assert.equal(name, 'file03.txt'); break;
						case 4: assert.equal(name, 'file04.txt'); break;
					}
				});

				done();
			});
		});

		test("Content and file names match", function(done) {
			bulk(files, function(err, results) {
				assert.ifError(err);

				results.each(function(contents, name) {
					switch (name) {
						case 'file01.txt': assert.equal(contents.toString(), 'This is the first file.'); break;
						case 'file02.txt': assert.equal(contents.toString(), 'This is the second file.'); break;
						case 'file03.txt': assert.equal(contents.toString(), 'This is the third file.'); break;
						case 'file04.txt': assert.equal(contents.toString(), 'This is the fourth file.'); break;
					}
				});

				done();
			});
		});
	});
	suite('#get', function() {
		
	});
});