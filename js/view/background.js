var Background = Backbone.Marionette.ItemView.extend({
	initialize: function() {
		latitude = this.collection.at(0).get('latitude');
		longitude = this.collection.at(0).get('longitude');

		this.mapOptions = {
			zoom: 13,
			center: new L.LatLng(latitude, longitude),
		}	
	},

	render: function() {
		MyApp.map = new google.maps.Map(document.getElementById("map-canvas"), this.mapOptions);

		var image = 'image/vide__pt.png';

		this.collection.forEach(function(counter) {
			var latLng = new google.maps.LatLng(counter.get('latitude'), counter.get('longitude'));
			var marker = new google.maps.Marker({
				position: latLng,
				map: MyApp.map,
				icon: image
			});
		});

		var bikeLayer = new google.maps.BicyclingLayer();
		bikeLayer.setMap(MyApp.map);

		/*var osm = new L.TileLayer('http://{s}.tile.thunderforest.com/cycle/{z}/{x}/{y}.png');
    	var ggl = new L.Google('ROADMAP');

    	map = new L.Map('map-canvas', this.mapOptions);
    	map.addLayer(ggl);


    	var bikeLayer = new google.maps.BicyclingLayer();
  		bikeLayer.setMap(ggl._google);*/
	}
})