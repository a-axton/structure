/** @jsx React.DOM */
var React = require('react');
var _ = require('lodash');
var CodeMirror = require('codemirror');
var cssMode = require('../../../bower_components/codemirror/mode/css/css');
var inspector = require('../inspector/inspector');
var EditorClasses = require('./editor-classes');
var Watch = require('watch');
var watch = Watch.watch;
var unwatch = Watch.unwatch;
var callWatchers = Watch.callWatchers;
var DocumentEvents = require('./document-events');

var Doc = React.createClass({
    mixins: [DocumentEvents, EditorClasses],
    componentWillMount: function(){
        var active = this.props.active;
        var source = this.props.source;
        var cm = this.props.cm;

        var doc = CodeMirror.Doc(source.sourceContent, 'text/x-scss');
        
        if (active){
            this.setSourceActive(doc);
        }
        
        this.setState({doc: doc});

        // this.onEditorChanged();
        // this.onEditorClicked();
        // this.onEditorTab();
        // this.scrollToFirstMark();
        
    },
    setSourceActive: function(doc){
        var cm = this.props.cm;
        if (!doc){ var doc = this.state.doc }

        cm.swapDoc(doc);
        this.markSelectorSource();
        // this.scrollToFirstMark();
    },
    activateSource: function(){
        $('.editor-sources li').attr('data-active', false);
        $(this.getDOMNode()).attr('data-active', true);

        this.setSourceActive();
    },
    render: function(){
        return (
            <li data-active={this.props.active} onClick={this.activateSource}>
                <span>{this.props.source.source}</span>
            </li>
        );   
    }
});

module.exports = Doc;
