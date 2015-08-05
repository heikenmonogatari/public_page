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
		var boxArray = [];
		var index = 0;

		var self = this;

		var clonedCollection = new Backbone.Collection(this.collection.toJSON());

		this.setMarkersHelper(clonedCollection.toJSON(), bounds, selectedMarker, openedWindow, boxArray, index, self);
	},

	setMarkersHelper: function(clonedCollection, bounds, selectedMarker, openedWindow, boxArray, index, self) {

		var counter = clonedCollection.shift();

		if (counter) {

			console.log(counter);

			var dataCollection = new DataCollection();
			dataCollection.url = "https://api.eco-counter-tools.com/v1/" + "h7q239dd" + "/data/periode/" 
								+ counter.id
								+ '?begin=' + moment().subtract(1, 'M').format('YYYYMMDD')
								+ '&end=' + moment().subtract(1, 'd').format('YYYYMMDD')
								+ '&step=' + 4;

			console.log(moment().subtract(1, 'M').format('YYYYMMDD'));
			console.log(moment().subtract(1, 'd').format('YYYYMMDD'));

			dataCollection.fetch({
				success: function() {

					if (counter.userTypeHard == 7) {
						var image = 'image/vide__pt.png';
					}else if(counter.userTypeHard == 1) {
						var image = 'image/pieton__pt.png';
					}else if(counter.userTypeHard == 2) {
						var image = 'image/velo__pt.png';
					}else if(counter.userTypeHard == 12) {
						var image = 'image/pieton_velo_2_pt.png';
					}

					var latLng = new google.maps.LatLng(counter.latitude, counter.longitude);
					var marker = new google.maps.Marker({
						position: latLng,
						map: map,
						icon: image
					});

					bounds.extend(marker.position);

					var name = counter.name;

					// If displayedName attribute is filled, use it, otherwise use default name
					if (counter.displayedName) {
						name = counter.displayedName;
					}

					var averageTotal = 0;
					var averageLength =0;
					dataCollection.forEach(function(datum) {
						if (datum.get('comptage')) {
							averageTotal += datum.get('comptage');
							averageLength++;
						}
					});

					var average = (averageTotal/averageLength).toFixed();

					var yesterday = moment().subtract(1, 'd').startOf('d').format('YYYY-MM-DD HH:mm');

					var datum = dataCollection.find(function(datum) {
						return moment(datum.get('date')).format('YYYY-MM-DD HH:mm') == yesterday;
					});

					console.log(yesterday);

					if (datum) {
						var yesterdayCount = datum.get('comptage');
					}

					boxArray[index] = document.createElement('div');
					boxArray[index].class = 'infobox';
					var boxText = "<div class='name'>" + name + "</div>";
					boxText += "<div class='average'>Daily average: " + average + "</div>";
					boxText += "<div class='yesterday'>Yesterday: " + yesterdayCount + "</div>";

					console.log(boxArray[index].innerHTML);

					infobox = new InfoBox({
				        disableAutoPan: false,
				        maxWidth: 150,
				        pixelOffset: new google.maps.Size(-140, -110),
				        zIndex: null,
				        boxStyle: {
				           opacity: 1,
				           width: "280px"
				        },
				        closeBoxMargin: "12px 4px 2px 2px",
				        closeBoxURL: "http://www.google.com/intl/en_us/mapfiles/close.gif",
				        infoBoxClearance: new google.maps.Size(1, 1)
				    });

				    index++;

					/*var htmlContent = "<div class='markerBox'><div class='name'>" + name + "</div>";
						htmlContent += "<div class='average'>Daily average: " + average + "</div>";
						htmlContent += "<div class='yesterday'>Yesterday: " + yesterdayCount + "</div></div>";*/

					/*var infoWindow = new google.maps.InfoWindow({
						content: htmlContent
					});*/

					// Mouseover will open marker

					google.maps.event.addListener(marker, 'mouseover', function(content) {
						return function() {
							infobox.setContent(content);
							infobox.open(map, marker);
						}
					}(boxText));

					// Mouseout will close marker. Will keep the currently selected marker open
					google.maps.event.addListener(marker, 'mouseout', function() {
						infobox.close(map, marker);
						
						if (selectedMarker == this) {
							infobox.open(map,this);
						}
					});

					// Clicking will close the currently selected marker's window and open the clicked marker's window
					google.maps.event.addListener(marker, 'click', function() {
						var window = openedWindow.pop();

						if (window) {
							window.close();
						}

						selectedMarker = marker;
						infobox.open(map, marker);

						openedWindow.push(infobox);

						MyApp.trigger("markerClick", [map, counter]);
					});

					// Closing the marker will unselect the current marker
					google.maps.event.addListener(infobox,'closeclick',function(){
					   	selectedMarker = null;
					});

					self.setMarkersHelper(clonedCollection, bounds, selectedMarker, openedWindow, boxArray, index, self);
				}
			});						
		}else{
			map.fitBounds(bounds);
			console.log(boxArray);
		}

		/*this.collection.forEach(function(counter) {

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

			// If displayedName attribute is filled, use it, otherwise use default name
			if (counter.get('displayedName')) {
				name = counter.get('displayedName');
			}

			var htmlContent = "<div class='name'>" + name + "</div>";
			htmlContent += "<div class='photo'><img class='photo' src='" + counter.get('photo')[0] + "'/</div>";

			var infoWindow = new google.maps.InfoWindow({
				content: htmlContent
			});

			var dataCollection = new DataCollection();
			dataCollection.url = "https://api.eco-counter-tools.com/v1/" + "h7q239dd" + "/data/periode/" 
							+ counter.get('id')
							+ '?begin=' + moment().subtract(1, 'M').format('YYYYMMDD')
							+ '&end=' + moment().subtract(1, 'd').format('YYYYMMDD')
							+ '&step=' + 4;

			// Mouseover will open marker
			google.maps.event.addListener(marker, 'mouseover', function() {
				infoWindow.open(map, marker);
			});

			// Mouseout will close marker. Will keep the currently selected marker open
			google.maps.event.addListener(marker, 'mouseout', function() {
				infoWindow.close(map, marker);
				
				if (selectedMarker == this) {
					infoWindow.open(map,this);
				}
			});

			// Clicking will close the currently selected marker's window and open the clicked marker's window
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

			// Closing the marker will unselect the current marker
			google.maps.event.addListener(infoWindow,'closeclick',function(){
			   	selectedMarker = null;
			});
		});

		map.fitBounds(bounds);
*/
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

		// Add a bicycle path layer
		var bikeLayer = new google.maps.BicyclingLayer();
		bikeLayer.setMap(this.map);

		// Button will toggle bike layer on and off
		var bikeLaneControlDiv = document.createElement('button');
		var bikeLaneControl = new BikeLaneControl(bikeLaneControlDiv, this.map, bikeLayer);

		// Change position of button to TOP_LEFT, LEFT_TOP, TOP, TOP_RIGHT, RIGHT_TOP, etc...
		this.map.controls[google.maps.ControlPosition.TOP_LEFT].push(bikeLaneControlDiv);


	}
})