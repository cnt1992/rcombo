'use strict';

var fs = require('fs');
var rcombo = require('../index');

// CSS type
rcombo.combine({
    root: 'http://aotu.io/assets/',
    files: ['css/dist-00c0112f14.o2.css','fancybox/jquery.fancybox.css'],
    version: '1.0.0'
}).then(function( err, data ){
    //console.log(err, data);
    if( !err ){
        fs.writeFile('all.css', data, 'utf8', function(err){
            console.log(err);
        })
    }
})