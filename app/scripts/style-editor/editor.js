/** @jsx React.DOM */
var React = require('react');
var _ = require('lodash');
var CodeMirror = require('codemirror');
var cssMode = require('../../../bower_components/codemirror/mode/css/css');
var ElementSelector = require('../inspector/element-selector');
var inspector = require('../inspector/inspector');
var EditorClasses = require('./editor-classes');
var Tabs = require('./editor-tabs');
var Watch = require('watch');
var watch = Watch.watch;
var unwatch = Watch.unwatch;
var callWatchers = Watch.callWatchers;
var onChangeEvent;

var StyleEditor = React.createClass({
    mixins: [EditorClasses],
    componentDidMount: function(){
        var cm = CodeMirror($('.style-editor')[0], {
            value: '#foo { background: tomato; }',
            mode:  'text/x-scss',
            pollInterval: 300,
            lineNumbers: true
        });

        // init all event listeners
        this.setObjectListeners();

        // create resizable window for editor
        this.initResizable();
        
        this.setState({cm: cm});
    },
    getInitialState: function(){
        return {
            cm: null,
            selectors: null
        }
    },
    initResizable: function(){
        var resizable = $(this.getDOMNode())
        resizable.resizable({
            minWidth: 40,
            handles: "w",
            aspectRatio: 1.5,
            resize: function(){
                resizable.css({
                    right: 0, 
                    left: 'auto',
                    height: '100%'
                });
            }
        });
    },
    getSelectorFromLineNumber: function(lineNumber){
        // finds selector from linenumber of editor changed event changed line
        return _.find(this.state.selectors, function(selector){
            var start = selector.sourceStart.line;
            var end = selector.sourceEnd.line;
            
            return lineNumber >= start && lineNumber <= end;
        });
    },
    onEditorClicked: function(){
        var self = this;
        var cm = this.state.cm;

        cm.on('mousedown', function(editor, e){
            var cursor = cm.getCursor();
            var mark = cm.findMarksAt({line: cursor.line, ch: cursor.ch});
            
            self.setActiveMark(mark);
        });
    },
    setActiveMark: function(activateMark){
        // sets a mark as active
        var cm = this.state.cm;
        var marks = cm.getAllMarks();

        _.each(marks, function(mark){
            mark.active = false;
        });

        activateMark.active = true;
    },
    getMarkPosition: function(name){
        // tabs through marks belonging to active selector
        // selects first by default
        // returns next mark and position of mark
        var cm = this.state.cm;
        var marks = cm.getAllMarks();
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
        var cm = this.state.cm;
        var mark = this.getMarkPosition();

        cm.scrollIntoView(mark.position);
    },
    onEditorTab: function(){
        // user can tab through marks pertaining to active selector
        var self = this;
        var cm = this.state.cm;

        cm.on('keyHandled', function(editor, name, e){
            e.preventDefault();

            if (name == 'Cmd-Down' || name == 'Cmd-Up'){
                var mark = self.getMarkPosition(name);

                cm.scrollIntoView(mark.position);
            }
        });
    },
    onEditorChanged: function(){
        // handles editor changes and send changes to server
        var self = this;
        var cm = this.state.cm;
        var pollInterval;

        function sendEditContent(lineNumber){
            // var selectorSource = self.getSelectorFromLineNumber(lineNumber);
            // selectorSource.editContent = cm.getLine(lineNumber);
            var source = {
                lineNumber: lineNumber,
                editContent: cm.getValue()
            }
            
            $.ajax({
                url: '/edit-source',
                type: 'post',
                data: source
            });
        }

        function onChange(editor, changed){
            var lineNumber = changed.from.line;

            clearTimeout(pollInterval);

            pollInterval = setTimeout(function(){
                sendEditContent(lineNumber);
            }, 400);
        }

        delete cm._handlers.change[0];
        cm.on('change', onChange);
    },
    setObjectListeners: function(){
        // fired when element is clicked
        watch(inspector, 'selectors', this.recieveSelectors);
    },
    recieveSelectors: function(){
        var cm = this.state.cm.doc;
        var selectors = inspector.selectors;
        var source = inspector.source;
        var editorValues = [];
this.setState({ selectors: selectors });
        // writes content to editor
        // _.each(selectors, function(selector){
        //     editorValues.push(selector.contents);
        // });
        
        // write to editor
        cm.setValue(source);



        // editor events
        this.onEditorChanged();
        this.onEditorClicked();
        this.onEditorTab();
        
        // adds classes/widgets to editor
        // this.resetEditorLineWidgets();
        // this.setEditorLineWidgets();
        
        // mark editor at sources for active selectors
        this.resetMarkSelectorSource();
        this.markSelectorSource();
        
        // go to first selector mark
        this.scrollToFirstMark();
    
        
    },
    render: function(){
        return (
            <div className="style-editor-resizable">
                <Tabs selectors={this.state.selectors}/>
                <div className="style-editor"></div>
            </div>
            
        );
    }
});

module.exports = StyleEditor;