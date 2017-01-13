$(document).ready(function() {
	var countries = { 	IT:'#20B2AA',
						CH: 'red',
						DE: '#6959CD',
						FR: "blue" };
  
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
			}
		});
});