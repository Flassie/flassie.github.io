(function() {
	'use strict';
	
	$(document).ready(function() {
		 $('#world-map').vectorMap({
			map: 'world_mill',
			backgroundColor: 'transparent',
			zoomButtons: false,

			regionStyle: {
				initial: {
					fill: '#F1F1F1'
				},
				hover: {
					"fill-opacity": 1.0
				}
			},
			 
			markerStyle: {
				initial: {
					fill: 'red',
					stroke: '#383f47',
					"r": "5px"
        		}
    		},
			
			 onRegionTipShow: function(e, el, code) {
				 var prevent = true;
				 if(lastSrc === undefined) { return undefined; }
				 for(var i = 0; i < lastSrc.length; i++) {
					 var reg = lastSrc[i];
					 
					 if(reg.fillCountry === code) {
						 el.html(reg.name);
						 prevent = false;
					 } 
				 }
				 
				 if(prevent) {
					 e.preventDefault();
				 }
			 }
		});
	});
}());