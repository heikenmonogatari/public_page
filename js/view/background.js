var Background = Backbone.Marionette.ItemView.extend({
	initialize: function() {
		this.mapOptions = {
		
		}	
	},

	render: function() {

		map = new google.maps.Map(document.getElementById("map-canvas"), this.mapOptions);

		this.setMarkers(map);

		var bikeLayer = new google.maps.BicyclingLayer();
		bikeLayer.setMap(map);

		/*var osm = new L.TileLayer('http://{s}.tile.thunderforest.com/cycle/{z}/{x}/{y}.png');
    	var ggl = new L.Google('ROADMAP');

    	map = new L.Map('map-canvas', this.mapOptions);
    	map.addLayer(ggl);


    	var bikeLayer = new google.maps.BicyclingLayer();
  		bikeLayer.setMap(ggl._google);*/
	},

	setMarkers: function(map) {
		var bounds = new google.maps.LatLngBounds();
		var image = 'image/vide__pt.png';
		var selectedMarker = null;
		var openedWindow = [];

		this.collection.forEach(function(counter) {
			var latLng = new google.maps.LatLng(counter.get('latitude'), counter.get('longitude'));
			var marker = new google.maps.Marker({
				position: latLng,
				map: map,
				icon: image
			});

			bounds.extend(marker.position);

			var htmlContent = "<div class='name'>" + counter.get('name') + "</div>";
			htmlContent += "<div class='photo'><img class='photo' src='" + counter.get('photo')[0] + "'/</div>";

			var infoWindow = new google.maps.InfoWindow({
				content: htmlContent
			});

			google.maps.event.addListener(marker, 'mouseover', function() {
				infoWindow.open(map, marker);
			});

			google.maps.event.addListener(marker, 'mouseout', function() {
				infoWindow.close(map, marker);
				
				if (selectedMarker == this) {
					infoWindow.open(map,this);
				}
			});

			google.maps.event.addListener(marker, 'click', function() {

				var window = openedWindow.pop();

				if (window) {
					window.close();
				}

				selectedMarker = marker;
				infoWindow.open(map, marker);

				MyApp.trigger("markerClick", [map, counter]);
				openedWindow.push(infoWindow);
			});

			google.maps.event.addListener(infoWindow,'closeclick',function(){
			   	selectedMarker = null;
			});
		});

		map.fitBounds(bounds);

	}
})