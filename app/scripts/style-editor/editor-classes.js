/** @jsx React.DOM */
var React = require('react');
var _ = require('lodash');
var inspector = require('../inspector/inspector');

module.exports = {
    markSelectorSource: function(){
        var cm = this.props.cm;
        var source = this.props.source;
        var selectors = source.selectors;

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
            console.log(mark)
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
    getMarkPosition: function(name){
        // tabs through marks belonging to active selector
        // selects first by default
        // returns next mark and position of mark
        var doc = this.state.doc;
        var marks = doc.getAllMarks();
        var nextMarkIndex;
        var direction;
        var mark;
        var position;

        // change direction based on keys used
        if (name == 'Cmd-Down'){
            direction = 1;
        } else if (name == 'Cmd-Up'){
            direction = -1;
        }
        
        // find currently active mark
        var activeMarkIndex = _.findIndex(marks, function(mark){
            return mark.active;
        });

        if (activeMarkIndex < 0){
            marks[0].active = true;
            nextMarkIndex = 0;
        } else {
            var marksLength = marks.length;
            
            nextMarkIndex = activeMarkIndex + direction;
            
            if (nextMarkIndex > marksLength){
                nextMarkIndex = 0;
            } else if (nextMarkIndex < 0){
                nextMarkIndex = marksLength-2;
            }
            console.log(marks, nextMarkIndex, marksLength)
            // reset active flag of current mark
            marks[activeMarkIndex].active = false;

            // set active flag for next mark
            marks[nextMarkIndex].active = true;
        }

        mark = marks[nextMarkIndex];
        position = mark.find();

        return { 
            mark: mark,
            position: position
        }
    },
    scrollToFirstMark: function(){
        var doc = this.state.doc;
        var mark = this.getMarkPosition();

        doc.scrollIntoView(mark.position);
    },
    setActiveMark: function(activateMark){
        // sets a mark as active
        var doc = this.state.doc;
        var marks = doc.getAllMarks();

        _.each(marks, function(mark){
            mark.active = false;
        });

        activateMark.active = true;
    }
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