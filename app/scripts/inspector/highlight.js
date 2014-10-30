module.exports = {

	pageDoc: $(document.getElementById('page-content').contentDocument),
	pageWindow: document.getElementById('page-content').contentWindow,
	boxModel: $('.box-model'),
	elInfoBox: $('.box-model .element-info'),

	_calculatePadding: function( dimensions, selected ){
		if ( selected == true )
		var dom = this.selectedBoxModel.find('.padding'),
			contentBox = this.selectedBoxModel.find('.content-box'),
			el = this.selectedEl[0];
		else
		var dom = this.boxModel.find('.padding'),
			contentBox = this.boxModel.find('.content-box'),
			el = this.el[0];

		var domTop = contentBox.find('.paddingTop'),
			domRight = contentBox.find('.paddingRight'),
			domBottom = contentBox.find('.paddingBottom'),
			domLeft = contentBox.find('.paddingLeft'),
			styles = this.pageWindow.getComputedStyle( el ),
			paddingLeft = parseFloat( styles.paddingLeft ),
			paddingRight = parseFloat( styles.paddingRight ),
			paddingTop = parseFloat( styles.paddingTop ),
			paddingBottom = parseFloat( styles.paddingBottom );
		
		dom.css({
			width: dimensions.outerWidth - paddingLeft - paddingRight,
			height: dimensions.outerHeight - paddingTop - paddingBottom,
			left: paddingLeft,
			top: paddingTop
		});

		domTop.css({
			height: paddingTop,
			width: dimensions.outerWidth,
		});

		domRight.css({
			height: dimensions.height,
			width: paddingRight,
			top: paddingTop,
			right: 0
		});

		domBottom.css({
			height: paddingBottom,
			width: dimensions.outerWidth,
			bottom: 0
		});

		domLeft.css({
			height: dimensions.height,
			width: paddingLeft,
			top: paddingTop
		});
	},
	_calculateMargin: function( dimensions, selected ){
		if ( selected == true )
		var dom = this.selectedBoxModel.find('.margin'),
			el = this.selectedEl[0];
		else
		var dom = this.boxModel.find('.margin'),
			el = this.el[0];
		
		var domTop = dom.find('.marginTop'),
			domRight = dom.find('.marginRight'),
			domBottom = dom.find('.marginBottom'),
			domLeft = dom.find('.marginLeft'),
			styles = this.pageWindow.getComputedStyle( el ),
			marginLeft = parseFloat( styles.marginLeft ),
			marginRight = parseFloat( styles.marginRight ),
			marginTop = parseFloat( styles.marginTop ),
			marginBottom = parseFloat( styles.marginBottom );
		
		dom.css({
			width: dimensions.outerWidth + marginLeft + marginRight,
			height: dimensions.outerHeight + marginTop + marginBottom,
			left: marginLeft * -1,
			top: marginTop * -1
		});

		domTop.css({
			height: marginTop,
			width: dimensions.outerWidth + marginLeft + marginRight,
		});

		domRight.css({
			height: dimensions.outerHeight,
			width: marginRight,
			top: marginTop,
			right: 0
		});

		domBottom.css({
			height: marginBottom,
			width: dimensions.outerWidth + marginLeft + marginRight,
			bottom: 0
		});

		domLeft.css({
			height: dimensions.outerHeight,
			width: marginLeft,
			top: marginTop
		});
	},
	clear: function(){
		this.boxModel.hide();
	},
	selectedNodeIndicator: function( tagName, tagPosition, eventSource ){
		var tag = $('#dom-tree [data-tag="'+tagName.toUpperCase()+'"]:eq('+(tagPosition - 1)+')');
		
		if (eventSource != 'tree-hover')
		$('#dom-tree .tags').animate({ scrollTop: tag.position().top - 50 }, 200);
		$('.selected-tag').removeClass('selected-tag');
		tag.addClass('selected-tag');	
	},
	showElData: function( d ){
		var id = this.el.attr('id') || '',
			classes = this.el.attr('class') || '',
			info = {},
			infoDom,
			types;
		types = {
			text: ['p','h1','h2','h3','h4','h5','h6'],
			link: ['a'],
			list: ['ul','li','ol'],
			image: ['img','svg'],
			form: ['input','textarea','select']
		}
		if (classes)
		info.classes = '.' + classes.split(' ').join('.');
		
		if (id)
		info.id = '#' + id;
		info.tagName = this.el[0].tagName;
		info.outerWidth = d.outerWidth;
		info.outerHeight = d.outerHeight;
		for (var type in types){
			var tagName = info.tagName.toLowerCase();
			if ( types[type].indexOf( tagName ) > -1 )
			info.elType = type;
		}
		if (!info.elType) info.elType = 'empty';
		
		infoDom = $(elementInfoTemp(info));
		this.elInfoBox.empty().removeAttr('style').append( infoDom ).width( infoDom.width() + 12 );
	},
	create: function( el ){
		var d = {};
		this.el = el;
		
		d.offset = el.offset();
		d.outerWidth = el.outerWidth();
		d.outerHeight = el.outerHeight();
		d.width = el.width();
		d.height = el.height();
		
		// remove old highlighted node
		this.clear();
		this.boxModel.show().css({
			left: d.offset.left,
			top: d.offset.top,
			height: d.outerHeight,
			width: d.outerWidth,
		});
		this._calculatePadding( d );
		this._calculateMargin( d );
		// this.showElData( d );
	},
	resize: function(){
		if (!this.selectedEl) return;
		var el = this.selectedEl,
		d = {
			offset : el.offset(),
			outerHeight : el.outerHeight(),
			outerWidth : el.outerWidth(),
			width : el.width(),
			height : el.height()
		}
		this.boxModel.hide();
		this.selectedBoxModel.css({
			left: d.offset.left,
			top: d.offset.top,
			height: d.outerHeight,
			width: d.outerWidth,
		});
		// with selected: true argument
		this._calculatePadding( d, true );
		this._calculateMargin( d, true );
	}
}
	