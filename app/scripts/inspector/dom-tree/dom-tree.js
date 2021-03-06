/** @jsx React.DOM */
var React = require('react');
var _ = require('lodash');
var inspector = require('../inspector');
var xmlParse = require('./xml-parse');
var pageDoc = document.getElementById('page-content').contentDocument;
var Watch = require('watch');
var watch = Watch.watch;
var unwatch = Watch.unwatch;
var callWatchers = Watch.callWatchers;
// var NodeStore = require('./node-store');

var Node = React.createClass({
    findNode: function(e){
        // pass props to parent component
        this.props.findNode(e, this.props.node);
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
            <div className="node" data-selected={this.props.selected} onMouseEnter={this.findNode} onClick={this.findNode}>
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

        // walks parsed dom node tree
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
                            depth: count,
                            nodeId: data[i].nodeId
                        });
                    }

                    domWalker(data[i], count);       
                } 
            } else {       
                count = 0;
            }
        }

        // add body node
        listObj.push({
            id: body.id,
            tagName: 'body',
            class: body.class,
            depth: 0
        });
        
        // init node tree creation
        domWalker(domObj, count);
        
        // adds depth value for node tree list rendering
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

        // when user selected a dom element
        watch(inspector, 'selectedEl', this.highlightNode);
        
        // only create tree after dom loaded
        $(window).load(function() {
            var domTree = self.createDomTree();
        });
    },
    findNode: function(e, node){
        // recieved from child component
        // either highlights node on page
        // or selects if clicked
        var tagName = node.tagName;
        var tagPosition = node.count;
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

        if (select){
            this.setState({
                selectedNode: node,
                selectedNodeId: node.nodeId,
                scrollDomTree: false
            });    
        }
    },
    highlightNode: function(){
        // highlightes node in tree view based
        // on selected node on page
        var selectedNodeId = inspector.selectedEl[0].nodeId;
        var nodes = this.state.domTree;
        var selectedNodeIndex = _.findIndex(this.state.domTree, function(node){
            return node.nodeId == selectedNodeId;
        });
        var selectedNode = nodes[selectedNodeIndex];
        var scrollTop = (selectedNodeIndex * 23) + 150;
        
        if (this.state.scrollDomTree){
            $('.dom-tree-nodes').scrollTop(scrollTop);    
        }

        if (selectedNode){
            this.setState({
                selectedNode: selectedNode,
                selectedNodeId: selectedNode.nodeId,
                scrollDomTree: true
            });
        }
    },
    getInitialState: function(){
        return { 
            domTree: null,
            selectedNode: null,
            selectedNodeId: null,
            scrollDomTree: true
        };
    },
    render: function(){
        var treeNodes = _.map(this.state.domTree, function(node, i){
            if (node.nodeId == this.state.selectedNodeId){
                var selected = true;
            } else {
                var selected = false;
            }

            return <Node key={i} node={node} findNode={this.findNode} selected={selected}/>
        }.bind(this));

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