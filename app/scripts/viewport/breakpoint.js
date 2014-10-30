/** @jsx React.DOM */
var React = require('react');
var _ = require('lodash');

var Breakpoint = React.createClass({
    componentDidMount: function(){
        this.matchMedia();
    },
    getInitialState: function(){
        return {active: false}
    },
    matchMedia: function(){
        var frameWindow = document.getElementById('page-content').contentWindow;
        var breakpoint = this.props.breakpoint[0];
        var match = frameWindow.matchMedia('(max-width: '+breakpoint.value+')');
        
        match.addListener(function(){
            if(match.matches){
                this.setState({active: true});
            } else {
                this.setState({active: false});
            }
        }.bind(this));
    },
    activate: function(){
        this.props.activateBreakpoint(this.props.breakpoint);
    },
    render: function(){
        var breakpoint = this.props.breakpoint[0];
        var style = {
            width: breakpoint.value
        }
        
        return (
            <div style={style} data-active={this.state.active} onClick={this.activate} className="breakpoint"></div>
        );
    }
});

module.exports = Breakpoint;