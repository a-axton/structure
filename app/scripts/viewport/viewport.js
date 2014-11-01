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
var viewportText;
var viewport;
var startWidth;


var Viewport = React.createClass({
    componentDidMount: function(){
        var self = this;
        viewportWidth = $('.viewport-width');
        viewport = $('#viewport');
        viewportText = $('.viewport-text .value');

        watch(window.app, 'mediaQueries', this.recieveBreakpoints );
        
        this.initResizable();

        $(window).resize(function(){
            var windowWidth = $(this).width();
            var vpWidth = viewportWidth.width();
            
            if (windowWidth < startWidth){
                self.resizeViewport(windowWidth);

            }
        });
    },
    resizeViewport: function(currentWidth, animate){
        currentWidth = parseFloat(currentWidth);
        
        if (animate){
            var originalVal = parseFloat(viewportText.text());

            viewportWidth.css({ 
                margin: '0 auto', 
                left: '0px', 
                height: '32px'
            }).animate({'width': currentWidth}, 300);

            viewport.animate({'max-width': currentWidth}, {duration: 300, step: function(){ inspector.resize() }, complete: function(){ inspector.resize()}});

            $({vpTextVal: originalVal}).animate({vpTextVal: currentWidth}, {
                easing: 'linear',
                step: function(){ 
                    viewportText.text(Math.ceil(this.vpTextVal));
                },
                complete: function(){
                    viewportText.text(Math.round(currentWidth));
                }
            }, 200);
        } else {
            viewportWidth.css({ 
                margin: '0 auto', 
                left: '0px', 
                height: '32px',
                width: currentWidth
            });
            viewport.css('max-width', currentWidth);

            viewportText.text(Math.round(currentWidth));
        }

        inspector.resize();
    },
    fullSize: function(){
        this.resizeViewport($(window).width(), true);
    },
    initResizable: function(){
        var self = this;

        viewportWidth.resizable({
            minWidth: 240,
            minHeight: 25,
            handles: "e,w",
            aspectRatio: 1,
            
            create: function(){
                var currentWidth = viewportWidth.width();
                viewportText.text(Math.round(currentWidth));
                startWidth = currentWidth;
            },

            resize: function(){
                var currentWidth = viewportWidth.width();

                startWidth = currentWidth;
                self.resizeViewport(currentWidth);

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
        width = width.replace('px','').replace('em','');

        startWidth = width;
        this.resizeViewport(width, true);
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
                <div className="viewport-width" onDoubleClick={this.fullSize}>
                    <div className="viewport-text">
                        <span className="value">1140</span>
                        <span className="unit">px</span>
                    </div>
                    <div className="viewport-handle left-handle ui-resizable-handle ui-resizable-w ui-icon"></div>
                    <div className="viewport-handle right-handle ui-resizable-handle ui-resizable-e ui-icon"></div>
                </div>
            </div>
        );
    }
});

module.exports = Viewport;