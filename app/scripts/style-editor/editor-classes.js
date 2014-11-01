/** @jsx React.DOM */
var React = require('react');
var _ = require('lodash');
var SelectorInfo = require('./selector-info');
var inspector = require('../inspector/inspector');

module.exports = {
    markSelectorSource: function(){
        var cm = this.state.cm;
        var allSelectors = window.app.selectors;
        var selectors = inspector.selectors;

        _.each(selectors, function(selector){
            var start = selector.sourceStart;
            var end = selector.sourceEnd;
            
            var mark = cm.markText(
                { line: start.line, ch: start.column },
                { line: end.line, ch: end.column },
                {
                    className: 'marked-source',
                    startStyle: 'marked-source-start',
                    endStyle: 'marked-source-end',
                    title: selector.selector
                }
            );

            mark.selector = selector;
        });

        // this.setState({
        //     selectorSourceMarks: selectorSourceMarks,
        //     selectors: selectors
        // });
    },
    resetMarkSelectorSource: function(){
        var selectorSourceMarks = this.state.cm.getAllMarks();
        console.log(selectorSourceMarks)
        // remove old selector info widgets
        if (selectorSourceMarks){
            _.each(selectorSourceMarks, function(mark){
                mark.clear();
            });
        }
    },
    // resetEditorLineWidgets: function(){
    //     var selectorInfoWidgets = this.state.selectorInfoWidgets;
        
    //     // remove old selector info widgets
    //     if (selectorInfoWidgets){
    //         _.each(selectorInfoWidgets, function(widget){
    //             widget.clear();
    //         });
    //     }
    // },
    // setEditorLineWidgets: function(){
    //     var cm = this.state.cm;
    //     var selectors = inspector.selectors;
    //     var selectorInfoWidgets = [];
    //     var lineNumber = 0;

    //     _.each(selectors, function(selector, i){
    //         var selectorInfo = $(React.renderComponentToStaticMarkup(<SelectorInfo selector={selector}/>))[0];
    //         var linesUsed = selector.parsed.rules[0].decls.length + 1;
    //         var lineWidget = cm.addLineWidget(lineNumber, selectorInfo, { above: true, coverGutter: true });

    //         // line position in editor
    //         selector.editor = {
    //             start: lineNumber,
    //             end: lineNumber + linesUsed
    //         }

    //         selectorInfoWidgets.push(lineWidget);

    //         // sets line number for next rule
    //         lineNumber = lineNumber + linesUsed + 1;
    //     });

    //     this.setState({
    //         selectorInfoWidgets: selectorInfoWidgets,
    //         selectors: selectors
    //     });
    // }
}