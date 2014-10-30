/** @jsx React.DOM */
var React = require('react');
var _ = require('lodash');
var inspector = require('../inspector/inspector');
var Breakpoints = require('./breakpoints');
var Watch = require('watch');
var watch = Watch.watch;
var unwatch = Watch.unwatch;
var callWatchers = Watch.callWatchers;

var viewportWidth;
var viewport;

var Viewport = React.createClass({
    componentDidMount: function(){
        viewportWidth = $('.viewport-width');
        viewport = $('#viewport');
        watch(window.app, 'mediaQueries', this.recieveBreakpoints );
        this.initResizable();
    },
    initResizable: function(){
        viewportWidth.resizable({
            minWidth: 240,
            minHeight: 25,
            handles: "e,w",
            aspectRatio: 1,

            resize: function(){
                var currentWidth = viewportWidth.width();

                // constrain resizing and re-center
                viewportWidth.css({ 
                        margin: '0 auto', 
                        left: '0px', 
                        height: '32px' 
                });

                // resize viewport to match viewport resizer
                viewport.width(currentWidth);

                // update viewport text value
                // viewportText.text(Math.round(currentWidth));

                inspector.resize();

                // if (startingHeight < pageHeight.offsetHeight){
                //     iframe.height( pageHeight.offsetHeight );
                // }
            },
            stop: function(){
                inspector.resize();
            }
        });
    },
    activateBreakpoint: function(breakpoint){
        var width = breakpoint[0].value;

        inspector.resize();

        viewport.width(width);
        viewportWidth.css({ 
                margin: '0 auto', 
                left: '0px', 
                height: '32px',
                width: width
        });
    },
    recieveBreakpoints: function(){
        this.setState({ mediaQueries: window.app.mediaQueries });
    },
    getInitialState: function(){
        return { mediaQueries: null };
    },
    render: function(){
        return (
            <div className="viewport">
                <Breakpoints breakpoints={this.state.mediaQueries} activateBreakpoint={this.activateBreakpoint}/>
                <div className="viewport-width">
                    <div className="viewport-handle left-handle ui-resizable-handle ui-resizable-w ui-icon"></div>
                    <div className="viewport-handle right-handle ui-resizable-handle ui-resizable-e ui-icon"></div>
                </div>
            </div>
        );
    }
});

module.exports = Viewport;