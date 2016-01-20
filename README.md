# rcombo

A npm package to combine file and return the combined data.

## Install

```bash
npm install --save rcombo
```

## Usage

```javascript
var fs = require('fs');
var rcombo = require('rcombo');

rcombo.combine({
    root        : 'http://aotu.io/athena/dist/js/', // your root directory
    files       : ['modernizr.js','rome.js'],       // your files to combine
    version     : '1.0.0',                          // cached
    compress    : 1                                 // 1:compress， 0:no compress
}).then(function( err, data ){
    // data is the final result
    //console.log(err, data);
    if( !err ){
        fs.writeFile('all.js', data, 'utf8', function(err){
            console.log(err);
        })
    }
})
```

## Test

```bash
npm run "test js"
// or
npm run "test css"
```