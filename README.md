# node-read-bulk

Just a little helper module to save some time.

## Installation

    npm install read-bulk

## Usage

    var bulk = require('read-bulk');
    
    bulk.readFiles(['file', 'names'], function(err, files) {
        
        // Loop over each file.
        files.each(function(contents) {
            console.log(contents);
        });

        // Return a specific file by filename
        files.get('file');
        files.get('names');
    });