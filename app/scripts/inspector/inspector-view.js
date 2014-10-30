// 
// 
// not in use

define(['modules/inspector/inspector','antiscroll'], function( inspector ){
	'use strict';

	return {
		elData: function( el ){
			var tagName = el.tagName,
				width = el.outerWidth(),
				height = el.outerHeight(),
				tagName = el[0].tagName,
				tagIndicator = this.inspectorDom.find('.tag-name'),
				dimensions = this.inspectorDom.find('.dimensions .value');
				
			tagIndicator.text( tagName );
			dimensions.text(width + 'x' + height);
		},

		createDomTree: function( ){
			var domObj = this.xmlsimplify(this.pageDoc.body, true),
				tagNames = this.inspectorDom.find('#dom-tree .tags'),
				listObj = [],
				count = -1,
				listHTML = [];

			function tree(data, count) {    
			    if (typeof(data) == 'object') {        
					count++
			        for (var i in data) {

			        	if (data[i].nodeName){
			        		listObj.push({ tagName: data[i].nodeName, class: data[i].class, depth: count })
			        	}         
			            tree(data[i], count);       
			        }
			    } else {       
			        count = 0
			    }
			}
			
			tree(domObj, count)

			for (var i = 0; i < listObj.length; i++){
				var tagName = listObj[i].tagName,
					depth = listObj[i].depth,
					classes = listObj[i].class;

				if (!classes){
					classes = '';
				}
				listHTML.push('<div data-tag="'+tagName+'" style="padding-left: '+( depth * 5 )+'px;">'+tagName+'</div>')
			}
			
			tagNames.empty();
			tagNames.append( listHTML.join('') );
			$('.antiscroll-wrap').antiscroll();

		},

		xmlsimplify: function(xml, strip) {
		    var obj = {};
		    if (typeof xml === "string") {
		        xml = getXmlDocument(xml);
		    }
		    var traverse = function(node) {
		        var i, l, n, a, j;
		        if (node.nodeType) {
		            var o = {
		            	
		            };
		            switch (node.nodeType) {
		            case 1:
		                //element node;
		                o = {
		                    nodeName: node.nodeName,
		                }; //record nodename
		                for (i = 0, l = node.attributes.length, n = node.attributes; i < l; i++) { //append attributes
		                    a = traverse(n.item(i));
		                    for (j in a) {
		                        if (a.hasOwnProperty(j)) {
		                            o[j] = a[j];
		                        }
		                    }
		                }
		                if (node.childNodes.length) {
		                    o.childNodes = [];
		                    for (i = 0, l = node.childNodes.length, n = node.childNodes; i < l; i++) {
		                        a = traverse(n.item(i));
		                        if (a !== null) {
		                            o.childNodes.push(a);
		                        }
		                    }
		                    if (o.childNodes.length === 0) {
		                        delete o.childNodes;
		                    }
		                }
		                break;
		            case 2:
		                //attribute node
		                o[node.nodeName] = node.nodeValue; //return an attribute object
		                break;
		            case 3:
		                //text node
		                //strip empty nodes
		                if (node.nodeValue.match(/[^\s]/) && (strip === true)) {
		                    o = node.nodeValue;
		                } else {
		                    o = null;
		                }
		                if (strip !== true) {
		                    o = node.nodeValue;
		                }
		                break;
		            case 4:
		                //cdata section node
		                o = node.nodeValue;
		                break;
		            case 9:
		                //document node;
		                o = traverse(node.firstChild);
		                break;
		            case 10:
		                o = traverse(node.nextSibling);
		                break;
		            }
		        }
		        return o;
		    };
		    obj = traverse(xml);
		    return obj;
	},

		inspectorDom: $('#inspector'),
		pageDoc: document.getElementById('page-window').contentDocument,
	}
});