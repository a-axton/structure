var Actions = require('../actions');
var highlight = require('./highlight');
var _ = require('lodash');
	
module.exports = {
	selectors: null,
	pageDoc: $(document.getElementById('page-content').contentDocument),
	pageWindow: document.getElementById('page-content').contentWindow,

	highlight: function( elData ){
		if ( elData.hasOwnProperty('el') ){
			if ( elData.el.hasClass('.box-model-selected') ){ 
				return; 
			}
			this.el = elData.el;
		} else {
			this.el = this.pageDoc.find( elData.tagName ).filter(':eq('+( elData.tagPosition )+')');	
		} 
		
		// scroll page to show selected node
		// fired from dom node tree view
		if ( elData.scrollPage == true ){
			$('body').animate({'scrollTop': this.el.offset().top - 200}, 20);
		}

		// highlight dom node
		highlight.create( this.el );
		
		// either select node or just highlight it
		if ( elData.select == true ){
			this.select();
		}
	},
	selectorData: function(){
		// get selector source data from backend
		var self = this;
		var selectors = this.el.data();
		
		$.ajax({
	        url: '/get-source-from-selector',
	        type: 'POST',
	        data: selectors,
	        complete: function(data){
	        	data = JSON.parse(data.responseText);
	        	console.log(data)
	  			self.sources = data.sources;
	            self.selectors = _.sortBy(data.selectors, function(selector){ return -selector.specificity });
	        }
	    });
	},
	select: function(){
		// remove current selected box
		$('.box-model-selected').remove();

		// clone current highlight and convert it to selected highlight
		var selectedBoxModel = $('.box-model').clone(true).attr('class','box-model-selected').appendTo('#viewport');
		
		// get selector source data
		this.selectorData();
		this.selectedEl = this.el;
		highlight.selectedEl = this.el;
		highlight.selectedBoxModel = $('.box-model-selected');
		highlight.boxModel.hide();
	},
	resize: function(){
		highlight.resize();
	},
	clear: function(){
		$('.box-model').hide();
	}
}