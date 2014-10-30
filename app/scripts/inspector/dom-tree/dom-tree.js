/** @jsx React.DOM */
var React = require('react');
var _ = require('lodash');
var inspector = require('../inspector');
var xmlParse = require('./xml-parse');
var pageDoc = document.getElementById('page-content').contentDocument;

var Node = React.createClass({
    findNode: function(e){
        var node = $(this.getDOMNode());
        var tagName = this.props.node.tagName;
        var tagPosition = this.props.node.count;
        var select = false;

        if (e.type == 'click'){
            select = true;
        }
        
        inspector.highlight({
            tagPosition: tagPosition, 
            tagName: tagName,
            scrollPage: false,
            scrollDomTree: false,
            select: select
        });
    },
    render: function(){
        var node = this.props.node;
        var style = {
            'left': node.depth * 6
        }

        if (node.id){
            var id = '#' + node.id;
        }

        if (node.class){
            var classes = '.' + node.class.split(' ').join('.');
        }
        
        return (
            <div className="node" onMouseEnter={this.findNode} onClick={this.findNode}>
                <span style={style}>{node.tagName}{id}{classes}</span>
            </div>
        );
    }
});

var DomTree = React.createClass({
    createDomTree: function( ){
        var body = pageDoc.body;
        var domObj = xmlParse(body, true);
        var listObj = [];
        var nodeTypes = [];
        var count = -1;

        function domWalker(data, count) {    
            if (typeof(data) == 'object') {        
                count++;
                
                for (var i in data) {
                    var nodeName = data[i].nodeName;

                    if (nodeName && nodeName != 'SCRIPT'){
                        listObj.push({ 
                            tagName: nodeName,
                            id: data[i].id,
                            class: data[i].class, 
                            depth: count 
                        });
                    }

                    domWalker(data[i], count);       
                } 
            } else {       
                count = 0;
            }
        }

        listObj.push({
            id: body.id,
            tagName: 'body',
            class: body.class,
            depth: 0
        });
        
        domWalker(domObj, count);
        
        _.each(listObj, function(node, i){
            var nodeType = _.find(nodeTypes, { type: node.tagName });
            
            if (nodeType){
                nodeType.count = nodeType.count + 1;
                node.count = nodeType.count;
            } else {
                node.count = 0;
                nodeTypes.push({
                    type: node.tagName,
                    count: 0
                });
            }
        }.bind(this));

        this.setState({domTree: listObj});

        return listObj;
    },
    deselectBoxModel: function(){
        $('.box-model').hide();
    },
    componentDidMount: function(){
        var self = this;
        
        $(window).load(function() {
            var domTree = self.createDomTree();
        });
    },
    getInitialState: function(){
        return { domTree: null };
    },
    render: function(){
        var treeNodes = _.map(this.state.domTree, function(node, i){
            return <Node key={i} node={node}/>
        });

        return (
            <div className="dom-tree" onMouseOut={this.deselectBoxModel}>
                <div className="dom-tree-toggle"></div>
                <div className="dom-tree-nodes">
                    {treeNodes}
                </div>
            </div>
        );
    }
});

module.exports = DomTree;