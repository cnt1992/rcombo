'use strict';

var url         = require('url');
var request     = require('request');
var async       = require('async');
var UglifyJS    = require('uglify-js');
var CleanCSS    = require('clean-css');

;(function(){
    var rcombo = {};

    rcombo.combine = function( opt ){
        var self = this,
            opt = opt || {
                root: '',
                files: '',
                compress: 1
            };
        
        if( !opt.root || !opt.files ){
            throw 'opt.root or opt.files must not be empty';
        }

        // force transform opt.files to Array
        opt.files = [].concat( opt.files );
        this.opt = opt;
        this.fileType = (function(){
            var file = opt.files[0];
            return /\.css$/gi.test( file ) ? 'css' : 
                   /\.js$/gi.test( file ) ? 'js' : null;
        })();

        // check all file type
        if( !checkSuffix( opt.files ) ){
            throw 'your files type must be unity';
        }

        // only resolve js and css
        if( this.fileType === null ){
            throw 'your files must put on type .css or .js';
        }
        return this;
    }

    rcombo.then = function( fn ){
        var self = this,
            opt = self.opt,
            _data = [];

        async.auto({
            combine: function( callback ){
                var root = opt.root,
                    files = opt.files,
                    count = files.length,
                    _tmpData = {};

                files.forEach(function( file, i ){
                    var _url = url.resolve( root, file );
                    _url = addTimeStamp( _url );

                    request
                        .get( _url, function( error, response, body ){                      
                            _tmpData[ i ] = body;
                            console.log(_tmpData);
                            if( !--count ){
                                var len = getObjLen( _tmpData );
                                for( var j = 0; j < len; j++ ){
                                    _data.push( _tmpData[j] );
                                }
                                callback(null, _data.join(''));
                            }
                        } );
                });
            },
            minifyJS: ['combine', function( callback, result ){
                if( self.fileType == 'js' && opt.compress == 1 ){
                    var code = _data.join('');
                    var result = UglifyJS.minify( code, {fromString: true} );
                    callback( null, result.code );    
                }else {
                    callback( null, '' );
                }
                
            }],
            minifyCSS: ['combine', function( callback, result ){
                if( self.fileType == 'css' && opt.compress == 1 ){
                    var code = _data.join('');
                    var result = new CleanCSS().minify(code);
                    callback( null, result.styles );
                }else {
                    callback( null, '' );
                }                
            }]
        }, function( err, result ){            
            if( !err ){
                if( opt.compress == 1 ){
                    self.fileType == 'css' ? fn( err, result.minifyCSS ) : fn( err, result.minifyJS );                                    
                }else{
                    fn( err, _data.join('') );
                }            
            }else{
                throw err;
            }   
        });
    }

    function checkSuffix( files ){
        if( !Array.isArray( files ) ){
            return false;
        }
        var flag = true;
        var fileType = files[0].substring( files[0].lastIndexOf('.') + 1 );
        files.forEach(function( file, idx ){
            if( file.substring( file.lastIndexOf('.') + 1 ) !== fileType ){
                flag = false;
                return;
            }
        });
        return flag;
    }

    function getObjLen( obj ){
        if( !obj ) return false;
        var count = 0;
        for( var i in obj ){
            if( obj.hasOwnProperty(i) ){
                ++count;
            }
        }
        return count;
    }

    // 添加时间戳
    function addTimeStamp( url ){        
        var timestamp = +new Date();
        var flag = '';
        if( url.indexOf('?') !== -1 ){
            flag = '&t=';
        }else{
            flag = '?t=';
        }
        return url + flag + timestamp;
    }
    
    module.exports = rcombo;
})();
