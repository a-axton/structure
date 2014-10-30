var _ = require('lodash');
var path = require('path');
var fs = require('fs');
var lineReader = require('line-reader');
var postcss = require('postcss');
var sourceMap = require('source-map');
var Scouter = require('../vendor/scouter').Scouter;
var scouter = new Scouter();

module.exports = function(req, res, next){
    var sources = []; // source file location for each selector
    var selectors = req.body.selectors;
    var map = fs.readFileSync(path.join( __dirname, '../../build/assets/css/main.css.map'));
    var smc = new sourceMap.SourceMapConsumer(JSON.parse(map));
    var instream = fs.createReadStream(path.join( __dirname, '../../app/assets/styles/main.scss'));
    var lineCount = 0;

    function parseFileContents(){
        _.each(sources, function(source){
            var fileContents = source.fileContents.join('\n').replace(/[\]}{]/g,'');
            var contents = source.selector + ' {\n' + fileContents + '}';
            source.contents = contents;
            source.parsed = postcss.parse(contents)
        });
    }

    function getSourceOriginalPosition(selector){
        var startLine = parseFloat(selector.start.line);
        var startCol = parseFloat(selector.start.column);
        var endLine = parseFloat(selector.end.line);
        var endCol = parseFloat(selector.end.column);
        
        var sourceStart = smc.originalPositionFor({
            line: startLine,
            column: startCol
        });

        var sourceEnd = smc.originalPositionFor({
            line: endLine,
            column: endCol
        });

        return { 
            sourceStart: sourceStart,
            sourceEnd: sourceEnd,
        }
    }

    function buildSourceObject(selector){
        var specificity = scouter.score(selector.selector);
        var orignialPosition = getSourceOriginalPosition(selector);
        var params = selector.params;;

        var source = { 
            selector: selector.selector,
            specificity: specificity,
            sourceStart: orignialPosition.sourceStart,
            sourceEnd: orignialPosition.sourceEnd,
            lines: 0,
            fileContents: []
        }
        
        if (params){
            source.params = params;
            source.raw = selector.raw;
        }

        sources.push(source);
    }

    // adds file positions for selectors
    _.each(selectors, function(selector){
        
        buildSourceObject(selector);

        if (selector.mediaQueries){
            _.each(selector.mediaQueries, function(mq){
                buildSourceObject(mq);
            });
        }
    });
    
    var source = [];

    lineReader.eachLine(path.join( __dirname, '../../app/assets/styles/main.scss'), function(line, last) {
        // _.each(sources, function(source){
        //     if (lineCount >= source.sourceStart.line && lineCount <= source.sourceEnd.line){
        //         source.fileContents.push(line);
        //     }   

        // });
        source.push(line);
        lineCount++;
    }).then(function(){
        // parseFileContents();
        // console.log(sources)
        res.send({ source: source.join('\n'), selectors: sources });
    });
}