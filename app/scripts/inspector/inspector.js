var highlight = require('./highlight');
var _ = require('lodash');
	
module.exports = {
	selectors: null,
	pageDoc: $(document.getElementById('page-content').contentDocument),
	pageWindow: document.getElementById('page-content').contentWindow,

	highlight: function( elData ){
		if (!elData.tagName && !elData.hasOwnProperty('el')){
			return;
		} else if ( elData.hasOwnProperty('el') ){
			if ( elData.el.hasClass('.box-model-selected') ){ 
				return; 
			}
			this.el = elData.el;
		} else {
			this.el = this.pageDoc.find( elData.tagName ).filter(':eq('+( elData.tagPosition )+')');	
		} 
		
		if ( elData.scrollPage == true ){
			$('body').animate({'scrollTop': this.el.offset().top - 200}, 20);
		}

		highlight.create( this.el );
		
		if ( elData.select == true ){
			this.select();
		} else {
			highlight.elInfoBox.show();
		}
	},
	selectorData: function(){
		var self = this;
		var selectors = this.el.data();
		console.log(selectors)
		$.ajax({
	        url: '/get-source-from-selector',
	        type: 'POST',
	        data: selectors,
	        complete: function(data){
	        	data = JSON.parse(data.responseText);
	        	console.log(data.selectors)
	  			self.source = data.source;
	            self.selectors = _.sortBy(data.selectors, function(selector){ return -selector.specificity });
	        }
	    });
	},
	select: function(){
		$('.box-model-selected').remove();
		var selectedBoxModel = $('.box-model').clone(true).attr('class','box-model-selected').appendTo('#viewport');
		
		this.selectorData();
		highlight.selectedEl = this.el;
		highlight.selectedBoxModel = $('.box-model-selected');
		highlight.boxModel.hide();
	},
	resize: function(){
		highlight.resize();
	},
	clear: function(){
		$('.box-model').hide();
		delete this.selectedEl;
	}
}