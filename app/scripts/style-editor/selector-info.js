/** @jsx React.DOM */
var React = require('react');
var _ = require('lodash');

var MediaQuery = React.createClass({
    render: function(){
        var param = this.props.param;
        return (
            <div className="media-rule">{param.property} {param.value}</div>
        );
    }
});

var SelectorInfo = React.createClass({
    render: function(){
        var selector = this.props.selector;
        var mediaParams = _.map(selector.params, function(param){
            return <MediaQuery param={param}/>;
        });

        return (
            <div className="selector-info">
                <div className="icon source">
                    <span className="icon-code"></span>
                </div>
                <div className="icon query">
                    <span className="icon-mq"></span>
                </div>
                <div className="source">
                    {selector.sourceStart.source} line: {selector.sourceStart.line}
                </div>
                <div className="media-query">
                    {mediaParams}
                </div>
            </div>
        );
    }
});

module.exports = SelectorInfo;