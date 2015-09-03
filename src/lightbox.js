;(function ( $ ) {
	
	if (!$.lightbox) {
		$.lightbox = {};
	};
	
	//
	//
	//
	
	$.lightbox.elements		= undefined;
	$.lightbox.data			= undefined;
	$.lightbox.dom			= undefined;
	$.lightbox.maxDimensions	= undefined;
	
	//
	//
	//

	$.lightbox.fn = {
		
		getElements: function() {
			$.lightbox.elements = $('[data-lightbox]');
		},
		
		createDom: function() {
		
			$.lightbox.dom						= {};
			$.lightbox.dom.lightbox					= $('<div id="lightbox"></div>');
			$.lightbox.dom.lightbox.bg				= $('<div class="lightbox_bg"></div>').appendTo( $.lightbox.dom.lightbox );
			$.lightbox.dom.lightbox.container			= $('<div class="lightbox_container"></div>').appendTo( $.lightbox.dom.lightbox );
			$.lightbox.dom.lightbox.container.window		= $('<div class="lightbox_window"></div>').appendTo( $.lightbox.dom.lightbox.container );
			$.lightbox.dom.lightbox.container.window.frame		= $('<div class="lightbox_frame"></div>').appendTo( $.lightbox.dom.lightbox.container.window );
			$.lightbox.dom.lightbox.container.window.frame.img	= $('<img>').appendTo( $.lightbox.dom.lightbox.container.window.frame );
			$.lightbox.dom.lightbox.nav				= $('<div class="lightbox_nav"></div>');
			$.lightbox.dom.lightbox.ajax				= $('<div class="lightbox_ajax"></div>').appendTo( $.lightbox.dom.lightbox.container.window );
			$.lightbox.dom.lightbox.buttons				= {};
			$.lightbox.dom.lightbox.buttons.close			= $('<button class="lightbox_close"><span class="icon"></span><span class="text">Close</span></button>').appendTo( $.lightbox.dom.lightbox.container.window.frame );
			$.lightbox.dom.lightbox.buttons.previous		= $('<button class="lightbox_previous"><span class="icon"></span><span class="text">Previous</span></button>').appendTo( $.lightbox.dom.lightbox.nav );
			$.lightbox.dom.lightbox.buttons.next			= $('<button class="lightbox_next"><span class="icon"></span><span class="text">Next</span></button>').appendTo( $.lightbox.dom.lightbox.nav );
			
			$.lightbox.dom.lightbox.appendTo('body');
			
		},
		
		createBinds: function() {
			
			$.lightbox.elements
			.on('click', function(event) {
				
				event.preventDefault();
				
				var element = $(this);
				
				$.lightbox.fn.getData( element );
				$.lightbox.fn.doNav();
				$.lightbox.fn.createNavBinds();
				$.lightbox.fn.showLightbox();
				$.lightbox.fn.showAjaxLoader();
				$.lightbox.fn.loadImg();
				$.lightbox.fn.getMaxDimensions();
				$.lightbox.fn.setMaxDimensions();
				
			});
			
			$.lightbox.dom.lightbox.container.window.frame.img
			.on('load', function() {
				$.lightbox.data.current.loaded = true;
				$.lightbox.fn.showButtonClose();
				$.lightbox.fn.hideAjaxLoader();
				$.lightbox.fn.showImg();
			});
			
		},
		
		createNavBinds: function() {
			
			$.lightbox.dom.lightbox.buttons.previous
			.off()
			.on('click', function(event) {
				$.lightbox.fn.changeImage('previous');
			});
			
			$.lightbox.dom.lightbox.buttons.next
			.off()
			.on('click', function(event) {
				$.lightbox.fn.changeImage('next');
			});
			
			$.lightbox.dom.lightbox.buttons.close
			.off()
			.on('click', function(event) {
				$.lightbox.fn.closeLightbox();
			});
			
		},
		
		getData: function( element ) {
			
			if ( !$.lightbox.data ) {
				$.lightbox.data = {};
			};
			
			$.lightbox.data.current = {};
			$.lightbox.data.current.href = element.attr('href');
			$.lightbox.data.group = {};
			$.lightbox.data.group.name = element.data('lightbox') == '' ? undefined : element.data('lightbox');
			$.lightbox.data.group.elements = $.lightbox.elements.map( function(index, element) {
				if ( $(element).data('lightbox') == $.lightbox.data.group.name ) {
					return element;
				};
			});
			$.lightbox.data.group.elements.map( function(index, element) {
				if ( $(element).attr('href') == $.lightbox.data.current.href ) {
					$.lightbox.data.current.index = index;
				};
			});
			
		},
		
		changeImage: function ( direction ) {
			
			if ( direction == 'previous' ) {
				$.lightbox.data.current.index = $.lightbox.data.current.index == 0 ? $.lightbox.data.group.elements.length - 1 : $.lightbox.data.current.index - 1;
			}
			else if ( direction == 'next' ) {
				$.lightbox.data.current.index = $.lightbox.data.current.index == $.lightbox.data.group.elements.length - 1 ? 0 : $.lightbox.data.current.index + 1;
			};
			
			$.lightbox.data.current.href = $.lightbox.data.group.elements[$.lightbox.data.current.index].href;
			
			$.lightbox.fn.hideButtonClose();
			$.lightbox.fn.hideImg();
			$.lightbox.fn.removeImg();
			$.lightbox.fn.showAjaxLoader();
			$.lightbox.fn.loadImg();
		
		},
		
		doNav: function() {			
			
			if ( $.lightbox.data.group.elements.length > 1 ) {
				$.lightbox.fn.insertNav();
			}
			else {
				$.lightbox.fn.removeNav();
			};
			
		},
		
		insertNav: function() {
			$.lightbox.dom.lightbox.nav.insertBefore( $.lightbox.dom.lightbox.container );
		},
		
		removeNav: function() {
			$.lightbox.dom.lightbox.nav.remove();
		},
		
		showImg: function() {
			$.lightbox.dom.lightbox.container.window.frame.img.addClass('visible');
		},
		
		hideImg: function() {
			$.lightbox.dom.lightbox.container.window.frame.img.removeClass('visible');
		},
		
		removeImg: function() {
			$.lightbox.dom.lightbox.container.window.frame.img.attr('src', '');
			$.lightbox.data.current.loaded = false;
		},
		
		loadImg: function() {			
			$.lightbox.dom.lightbox.container.window.frame.img.attr('src', $.lightbox.data.current.href );
		},
		
		getMaxDimensions: function() {
			
			if ( !$.lightbox.maxDimensions ) {
				$.lightbox.maxDimensions = {};
			};
			
			$.lightbox.maxDimensions.width = Math.floor( $.lightbox.dom.lightbox.container.window.width() );
			$.lightbox.maxDimensions.height = Math.floor( $.lightbox.dom.lightbox.container.window.height() );
		
		},
		
		setMaxDimensions: function() {
			
			$.lightbox.dom.lightbox.container.window.frame.img.css({
				'max-width': $.lightbox.maxDimensions.width + 'px',
				'max-height': $.lightbox.maxDimensions.height + 'px'
			});
		
		},
		
		showLightbox: function() {
			$.lightbox.dom.lightbox.addClass('visible');
		},
		
		hideLightbox: function() {
			$.lightbox.dom.lightbox.removeClass('visible');
		},
		
		closeLightbox: function() {
			$.lightbox.fn.hideImg();
			$.lightbox.fn.hideButtonClose();
			$.lightbox.fn.removeImg();
			$.lightbox.fn.hideLightbox();
		},
		
		showButtonClose: function() {
			$.lightbox.dom.lightbox.buttons.close.addClass('visible');
		},
		
		hideButtonClose: function() {
			$.lightbox.dom.lightbox.buttons.close.removeClass('visible');
		},
		
		showAjaxLoader: function() {
			$.lightbox.dom.lightbox.ajax.addClass('visible');
		},
		
		hideAjaxLoader: function() {
			$.lightbox.dom.lightbox.ajax.removeClass('visible');
		}
		
	};
	
	//
	//
	//

	$.lightbox.init = function() {
		
		$.lightbox.fn.getElements();
		$.lightbox.fn.createDom();
		$.lightbox.fn.createBinds();
	
		$(window).on('resize', function(event) {
			$.lightbox.fn.getMaxDimensions();
			$.lightbox.fn.setMaxDimensions();
		});
		
	}();

})( jQuery );
