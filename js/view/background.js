var Background = Backbone.Marionette.ItemView.extend({

	initialize: function() {
		this.mapOptions = {
		
		}	
	},

	render: function() {

		map = new google.maps.Map(document.getElementById("map-canvas"), this.mapOptions);
		this.map = map;

		this.setMarkers(map);

		/*var osm = new L.TileLayer('http://{s}.tile.thunderforest.com/cycle/{z}/{x}/{y}.png');
    	var ggl = new L.Google('ROADMAP');

    	map = new L.Map('map-canvas', this.mapOptions);
    	map.addLayer(ggl);


    	var bikeLayer = new google.maps.BicyclingLayer();
  		bikeLayer.setMap(ggl._google);*/
	},

	setMarkers: function(map) {
		var bounds = new google.maps.LatLngBounds();
		/*var image = 'image/vide__pt.png';*/
		var selectedMarker = null;
		var openedWindow = [];

		this.collection.forEach(function(counter) {

			if (counter.get('userTypeHard') == 7) {
				var image = 'image/vide__pt.png';
			}else if(counter.get('userTypeHard') == 1) {
				var image = 'image/pieton__pt.png';
			}else if(counter.get('userTypeHard') == 2) {
				var image = 'image/velo__pt.png';
			}else if(counter.get('userTypeHard') == 12) {
				var image = 'image/pieton_velo_2_pt.png';
			}

			var latLng = new google.maps.LatLng(counter.get('latitude'), counter.get('longitude'));
			var marker = new google.maps.Marker({
				position: latLng,
				map: map,
				icon: image
			});

			bounds.extend(marker.position);

			var name = counter.get('name');

			if (counter.get('displayedName')) {
				name = counter.get('displayedName');
			}

			var htmlContent = "<div class='name'>" + name + "</div>";
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

	},

	onShow: function() {
		function BikeLaneControl(controlDiv, map, layer) {

			controlDiv.style.padding = "0px";
			controlDiv.style.backgroundColor = "transparent";
			controlDiv.style.border = '2px solid #fff';
			controlDiv.style.borderRadius = '3px';
			controlDiv.style.boxShadow = '0 2px 6px rgb(0,0,0)';

			// Set CSS for the control border
			var controlUI = document.createElement('div');
			controlUI.style.backgroundColor = '#fff';
			controlUI.style.border = '2px solid #fff';
			controlUI.style.borderRadius = '3px';
		 	controlUI.style.boxShadow = '0 2px 6px rgb(0,0,0)';
			controlUI.style.cursor = 'pointer';
			controlUI.style.textAlign = 'center';
			controlUI.title = 'Click to toggle bike lanes';
			controlDiv.appendChild(controlUI);

			// Set CSS for the control interior
			var controlText = document.createElement('div');
			controlText.style.color = 'rgb(25,25,25)';
			controlText.style.fontFamily = 'Roboto,Arial,sans-serif';
			controlText.style.fontSize = '16px';
			controlText.style.lineHeight = '38px';
			controlText.style.paddingLeft = '5px';
			controlText.style.paddingRight = '5px';
			controlText.innerHTML = 'Bike Lanes';
			controlUI.appendChild(controlText);

		 	google.maps.event.addDomListener(controlUI, 'click', function() {
		  		if(layer.getMap()){
			    	layer.setMap(null);
			    }else{
			    	layer.setMap(map);
			   	}
		  	});
		}

		var bikeLayer = new google.maps.BicyclingLayer();
		bikeLayer.setMap(this.map);

		var bikeLaneControlDiv = document.createElement('button');
		var bikeLaneControl = new BikeLaneControl(bikeLaneControlDiv, this.map, bikeLayer);

		this.map.controls[google.maps.ControlPosition.TOP_LEFT].push(bikeLaneControlDiv);


	}
})