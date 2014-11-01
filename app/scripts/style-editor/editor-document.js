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

var Doc = React.createClass({
    render: function(){
        
    }
});

module.exports = Doc;
