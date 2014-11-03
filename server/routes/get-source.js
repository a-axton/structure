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
    var selectorSources = [];
    var selectors = req.body.selectors;
    var map = fs.readFileSync(path.join( __dirname, '../../build/assets/css/main.css.map'));
    var smc = new sourceMap.SourceMapConsumer(JSON.parse(map));

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
        var params = selector.params;
        var sourceFile = orignialPosition.sourceStart.source.replace('/source/','');
        var existingSource = _.find(sources, function(source){
            return source.source == sourceFile;
        });

        var selectorSource = { 
            selector: selector.selector,
            specificity: specificity,
            source: sourceFile,
            sourceStart: orignialPosition.sourceStart,
            sourceEnd: orignialPosition.sourceEnd
        }

        if (params){
            selectorSource.params = params;
        }

        if (existingSource){
            existingSource.selectors.push(selectorSource);
        } else {
            sources.push({
                source: sourceFile,
                sourceContent: null,
                selectors: [selectorSource]
            });
        }

        selectorSources.push(selectorSource);
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

    var done = _.after(sources.length, function() {
        res.send({ sources: sources, selectors: selectorSources });
    });

    _.forEach(sources, function(source) {
        var sourcePath = path.join( __dirname, '../../app/assets/styles/' + source.source);
        var sourceContent = [];
        var lineCount = 0;

        lineReader.eachLine(sourcePath, function(line, last) {
            sourceContent.push(line);
            lineCount++;
        }).then(function(){
            source.sourceContent = sourceContent.join('\n');
            done();
        });    
    });
}