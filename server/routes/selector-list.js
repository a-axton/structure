var _ = require('lodash');
var path = require('path');
var fs = require('fs');
var postcss = require('postcss');
var parseVars = require('./parse-vars');

module.exports = function(req, res){
    var css = fs.readFileSync(path.join( __dirname, '../../build/assets/css/main.css'));
    var selectors = [];
    var mediaQueries = [];
    var removeAbove;

    function addToMediaQueryList(mediaParams){
        var contains = false; 
        mediaParams = mediaParams.match(/\((.*?)\)/g);
        
        var parsedQuery = _.map(mediaParams, function(param){
            param = param.replace(/[\])(]/g,'').replace(/\s/g, '').split(':');
            return {
                property: param[0],
                value: param[1]
            }
        });

        _.each(mediaQueries, function(mediaQuery){
            if (_.isEqual(mediaQuery, parsedQuery)){
                contains = true;
            }
        });

        if (!contains){
            mediaQueries.push(parsedQuery);
        }

        return parsedQuery;
    }

    // logs each selector with start/end position
    var ruleParser = postcss(function (css) {
        css.each(function (rule) {
            var entry;
            
            switch (rule.type){
                // basic selector rule
                case 'rule':
                    var entry = {
                        selector: rule.selector,
                        selectors: rule.selectors,
                        start: rule.source.start,
                        end: rule.source.end
                    }

                    selectors.push(entry);
                    break;
                case 'atrule':
                // @media rule (media query)
                // 1.   adds media query rules to root version
                //      of that selector
                // 2.   if selector doesn't exists add to root list
                    if (rule.name != 'media' || rule.params == 'print'){ return; }
                    rule.eachRule(function (mediaRule){
                        
                        var rootSelectorRule = _.find(selectors, function(entry) {
                            return entry.selector == mediaRule.selector;
                        });

                        var parsedMediaEntry = addToMediaQueryList(rule.params);

                        var entry = {
                            selector: mediaRule.selector,
                            start: mediaRule.source.start,
                            end: mediaRule.source.end,
                            params: parsedMediaEntry
                        }
                        
                            selectors.push(entry)

                        // if (!rootSelectorRule){
                        //     selectors.push(entry)
                        // } else if (!rootSelectorRule.mediaQueries){
                        //     rootSelectorRule.mediaQueries = [entry];
                        // } else {
                        //     rootSelectorRule.mediaQueries.push(entry);
                        // }
                    });
                    break;
                case 'comment':
                // comments are used to mark important positions in css file
                // 1.   !ATTN comment is the starting point to save css rules,
                //      usefule for ignoring css libraries/resets
                // 2.   variables and variable groups that need to be accessed in the app
                    if (rule.text.indexOf('!ATTN') > -1){
                        removeAbove = selectors.length;
                    }
            } 
        });
    });

    css = ruleParser.process(css);
    
    // if css file contains !ATTN comment
    // removes all selector entries above that point
    if (removeAbove){
        selectors.splice(0, removeAbove);
    }

    parseVars.parse(function(parsedVars) {
        res.send({selectors: selectors, mediaQueries: mediaQueries, variables: parsedVars});
    });

}