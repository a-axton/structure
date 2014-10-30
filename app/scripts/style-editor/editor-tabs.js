/** @jsx React.DOM */
var React = require('react');
var _ = require('lodash');

var Tab = React.createClass({
    
    render: function(){
        return (
            <li data-active={this.props.active}><span>{this.props.source}</span></li>
        );
    }
});

var Tabs = React.createClass({
    getSources: function(){
        var selectors = this.props.selectors;
        var sources = [];

        _.each(selectors, function(selector){
            var source = selector.sourceStart.source;
                source = source.replace('/source/','');

            if (sources.indexOf(source) < 0){
                sources.push(source);
            }
        });

        return sources;
    },
    render: function(){
        var sources = this.getSources();
        var tabs =  _.map(sources, function(source, i){
                        var active;

                        if (i == 0){
                            active = true;
                        } else {
                            active = false;
                        }

                        return <Tab active={active} source={source}/>
                    });

        return (
            <ul className="editor-sources">
                {tabs}
            </ul>
        );
    }
});

module.exports = Tabs;