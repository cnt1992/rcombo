'use strict';

var fs = require('fs');
var rcombo = require('../index');

// JS type
rcombo.combine({
    root: 'http://code.jquery.com/',
    files: ['jquery-1.11.2.min.js','jquery-1.11.2.js'],
    version: '1.0.0',
    compress: 0
}).then(function( err, data ){
    if( !err ){
        fs.writeFile('all.js', data, 'utf8', function(err){
            console.log(err);
        })
    }
});