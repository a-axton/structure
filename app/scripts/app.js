/** @jsx React.DOM */
var React = require('react');
var selectorList = require('./style-editor/build-selector-list');
var StyleEditor = require('./style-editor/editor');
var DomTree = require('./inspector/dom-tree/dom-tree');
var Viewport = require('./viewport/viewport');
var _ = require('./vendor').lodash;
// define global
window.app = {};

React.renderComponent(
    <StyleEditor/>,
    document.getElementById('style-editor')
);

React.renderComponent(
    <DomTree/>,
    document.getElementById('dom-tree')
);

React.renderComponent(
    <Viewport/>,
    document.getElementById('viewport-bar')
);
