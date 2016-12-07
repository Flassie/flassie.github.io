$(document).ready(function() {
	var countries = { 	IT:'#20B2AA',
						CH: 'red',
						DE: '#6959CD',
						FR: "blue" };
  
     $('#world-map').vectorMap({
			map: 'world_mill',
			backgroundColor: 'white',
			zoomButtons: false,
			regionStyle: {
				initial: {
					fill: 'darkgray'
				},
				hover: {
					"fill-opacity": 1.0
				}
			},
			
			onRegionOver: function(e, code) {
				$("[data-code='" + code + "']").css("fill-opacity", "0.5");
			},
			onRegionOut: function(e, code) {
				document.body.style.cursor = 'default';
				$("[data-code='" + code + "']").css("fill-opacity", "1.0");
			}
		});
});