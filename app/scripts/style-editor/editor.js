/** @jsx React.DOM */
var React = require('react');
var _ = require('lodash');
var CodeMirror = require('codemirror');
var cssMode = require('../../../bower_components/codemirror/mode/css/css');
var inspector = require('../inspector/inspector');
var Document = require('./editor-document');
var Watch = require('watch');
var watch = Watch.watch;
var unwatch = Watch.unwatch;
var callWatchers = Watch.callWatchers;
var onChangeEvent;

var StyleEditor = React.createClass({
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

        this.toggleButton();
        
        this.setState({cm: cm});
    },
    toggleButton: function(){
        var self = this;
        var toggleButton = $('#style-editor-toggle');
        var editor = $('#style-editor');
        
        toggleButton.click(function(){
            toggleButton.toggleClass('toggle');

            if (toggleButton.hasClass('toggle')){
                self.showEditor();
            } else {
                self.hideEditor();
            }
        }).hover(function(){
            if (!toggleButton.hasClass('toggle')){
                self.showEditor();
            }
        },function(e){
            console.log($(e.relatedTarget))
            if (!toggleButton.hasClass('toggle') && !$(e.relatedTarget).parent('#style-editor')){
                self.hideEditor();
            }
        });

        editor.mouseleave(function(){
            if (!toggleButton.hasClass('toggle')){
                self.hideEditor();
            }
        });
    },
    showEditor: function(){
        var editor = $('#style-editor');

        editor.css({right: 0});
    },
    hideEditor: function(){
        var editor = $('#style-editor');

        editor.css({right: -editor.width()});
    },
    getInitialState: function(){
        return {
            cm: null,
            sources: [],
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


    setObjectListeners: function(){
        // fired when element is clicked
        watch(inspector, 'selectors', this.recieveSelectors);
    },
    recieveSelectors: function(){
        var cm = this.state.cm;
        var selectors = inspector.selectors;
        var sources = inspector.sources;
        var editorValues = [];
        
        this.setState({
            selectors: selectors,
            sources: sources
        });

        this.showEditor();
    },
    render: function(){
        var documents = _.map(this.state.sources, function(source, i){
                            var active = i == 0 ? true : false
                            return <Document source={source} cm={this.state.cm} active={active}/>
                        }.bind(this));

        return (
            <div className="style-editor-resizable">
                <ul className="editor-sources">
                    {documents}
                </ul>
                <div className="style-editor"></div>
            </div>
        );
    }
});

module.exports = StyleEditor;