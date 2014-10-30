/** @jsx React.DOM */
var React = require('react');
var _ = require('lodash');
var Breakpoint = require('./breakpoint');

var Breakpoints = React.createClass({
    activateBreakpoint: function(breakpoint){
        // passing to viewport component
        this.props.activateBreakpoint(breakpoint);
    },
    render: function(){
        return (
            <div className="breakpoints">
                {_.map(_.sortBy(this.props.breakpoints, 'value'), function(breakpoint, i){
                    return <Breakpoint key={i} breakpoint={breakpoint} activateBreakpoint={this.activateBreakpoint}/>;
                }.bind(this))}
            </div>
        );
    }
});

module.exports = Breakpoints;