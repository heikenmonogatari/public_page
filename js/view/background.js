var selectedMarker = null;

var Background = Backbone.Marionette.ItemView.extend({

	template: "#map_template",

	tagName: "div",

	id: "map-canvas",

	className: "col-lg-12 col-md-12 col-sm-12 col-xs-12",

	onRender: function() {

		map = new google.maps.Map(this.el, this.mapOptions);
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
		var openedWindow = [];
		var boxArray = [];
		var index = 0;

		var self = this;

		var clonedCollection = new Backbone.Collection(this.collection.toJSON());

		this.setMarkersHelper(bounds, openedWindow, boxArray, index, self);
	},

	setMarkersHelper: function(bounds, openedWindow, boxArray, index, self) {

		var counter = self.collection.at(index);

		if (counter) {

			var dataCollection = new DataCollection();
			dataCollection.url = "https://api.eco-counter-tools.com/v1/" + "h7q239dd" + "/data/periode/" 
								+ counter.get('id')
								+ '?begin=' + moment().subtract(1, 'M').format('YYYYMMDD')
								+ '&end=' + moment().subtract(1, 'd').format('YYYYMMDD')
								+ '&step=' + 4;

			dataCollection.fetch({
				success: function() {

					counter.set({'data': dataCollection});

					if (counter.get('userTypeHard') == 7) {
						var image = 'image/vide__pt.png';
						var type = '';
					}else if(counter.get('userTypeHard') == 1) {
						var image = 'image/pieton__pt.png';
						var type = 'Pedestrian'
					}else if(counter.get('userTypeHard') == 2) {
						var image = 'image/velo__pt.png';
						var type = 'Bicycle';
					}else if(counter.get('userTypeHard') == 12) {
						var image = 'image/pieton_velo.png';
						var type = 'Bicycle and Pedestrian';
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

					if (datum) {
						var yesterdayCount = datum.get('comptage');
					}

					boxArray[index] = document.createElement('div');
					boxArray[index].class = 'infobox';
					var boxText = "<div class='name'>" + name + "</div>";
					boxText += "<div class='average'>Daily average: " + average + "</div>";
					boxText += "<div class='yesterday'>Yesterday: " + yesterdayCount + "</div>";
					boxText += "<div class='type'>Type: " + type + "</div>";

					infobox = new InfoBox({
				        disableAutoPan: true,
				        maxWidth: 50,
				        pixelOffset: new google.maps.Size(-140, -140),
				        zIndex: null,
				        boxStyle: {
				           opacity: 1,
				           width: "280px"
				        },
				        closeBoxMargin: "5px 2px 2px 2px",
				        closeBoxURL: "http://www.google.com/intl/en_us/mapfiles/close.gif",
				        infoBoxClearance: new google.maps.Size(1, 1)
				    });

				    index++;

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
					
						if (selectedMarker) {
							infobox.open(map, selectedMarker);
						}
					});

					// Clicking will close the currently selected marker's window and open the clicked marker's window
					google.maps.event.addListener(marker, 'click', function() {
						var window = openedWindow.pop();

						if (window) {
							window.close();
						}

						selectedMarker = this;
						infobox.open(map, marker);

						openedWindow.push(infobox);

						$('#map-container').removeClass().addClass('col-lg-4 col-md-4 col-sm-12 col-xs-12');

						//map.setCenter(marker.getPosition());

						MyApp.trigger("markerClick", [map, counter]);
					});

					// Closing the marker will unselect the current marker
					google.maps.event.addListener(infobox,'closeclick',function(){
					   	selectedMarker = null;
					});

					self.setMarkersHelper(bounds, openedWindow, boxArray, index, self);
				}
			});						
		}else{
			map.fitBounds(bounds);
			console.log(self.collection.toJSON());
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
			//controlDiv.style.border = '2px solid #fff';
			controlDiv.style.borderRadius = '3px';
			controlDiv.style.margin = '5px';
			//controlDiv.style.boxShadow = '0 2px 6px rgb(0,0,0)';

			// Set CSS for the control border
			var controlUI = document.createElement('div');
			controlUI.style.backgroundColor = '#fff';
			controlUI.style.border = '2px solid #fff';
			controlUI.style.borderRadius = '3px';
		 	//controlUI.style.boxShadow = '0 2px 6px rgb(0,0,0)';
			controlUI.style.cursor = 'pointer';
			controlUI.style.textAlign = 'center';
			controlUI.title = 'Click to toggle bike lanes';
			controlDiv.appendChild(controlUI);

			// Set CSS for the control interior
			var controlText = document.createElement('div');
			controlText.style.color = 'rgb(25,25,25)';
			controlText.style.fontFamily = 'Roboto,Arial,sans-serif';
			controlText.style.fontSize = '10x';
			controlText.style.lineHeight = '10px';
			controlText.style.paddingLeft = '5px';
			controlText.style.paddingRight = '5px';
			controlText.innerHTML = 'Bicycle infrastructure';
			controlUI.appendChild(controlText);

		 	google.maps.event.addDomListener(controlUI, 'click', function() {
		  		if(layer.getMap()){
			    	layer.setMap(null);
			    }else{
			    	layer.setMap(map);
			   	}
		  	});
		}

		/*function FullMapControl(controlDiv, map) {

			controlDiv.style.padding = "0px";
			controlDiv.style.backgroundColor = "transparent";
			//controlDiv.style.border = '2px solid #fff';
			controlDiv.style.borderRadius = '3px';
			controlDiv.style.margin = '5px';
			//controlDiv.style.boxShadow = '0 2px 6px rgb(0,0,0)';

			// Set CSS for the control border
			var controlUI = document.createElement('div');
			controlUI.style.backgroundColor = '#fff';
			controlUI.style.border = '2px solid #fff';
			controlUI.style.borderRadius = '3px';
		 	//controlUI.style.boxShadow = '0 2px 6px rgb(0,0,0)';
			controlUI.style.cursor = 'pointer';
			controlUI.style.textAlign = 'center';
			controlUI.title = 'Click to expand map';
			controlDiv.appendChild(controlUI);

			// Set CSS for the control interior
			var controlText = document.createElement('div');
			controlText.style.color = 'rgb(25,25,25)';
			controlText.style.fontFamily = 'Roboto,Arial,sans-serif';
			controlText.style.fontSize = '10x';
			controlText.style.lineHeight = '10px';
			controlText.style.paddingLeft = '5px';
			controlText.style.paddingRight = '5px';
			controlText.innerHTML = 'Expand Map';
			controlUI.appendChild(controlText);

		 	google.maps.event.addDomListener(controlUI, 'click', function() {
		  		$('#map-container').removeClass().addClass('col-lg-12 col-md-12 col-sm-12 col-xs-12');
		  		map.setCenter(selectedMarker.getPosition());
		  	});
		}*/

		// Add a bicycle path layer
		var bikeLayer = new google.maps.BicyclingLayer();
		bikeLayer.setMap(this.map);

		// Button will toggle bike layer on and off
		var bikeLaneControlDiv = document.createElement('button');
		var bikeLaneControl = new BikeLaneControl(bikeLaneControlDiv, this.map, bikeLayer);

		/*var fullMapDiv = document.createElement('button');
		var fullMapControl = new FullMapControl(fullMapDiv, this.map);*/

		// Change position of button to TOP_LEFT, LEFT_TOP, TOP, TOP_RIGHT, RIGHT_TOP, etc...
		this.map.controls[google.maps.ControlPosition.TOP_RIGHT].push(bikeLaneControlDiv);

		//this.map.controls[google.maps.ControlPosition.RIGHT_TOP].push(fullMapDiv);

		$('#map-container').append('<button type="button" class="btn btn-default" id="map-expand"><i class="glyphicon glyphicon-resize-horizontal"></i></button>');

		var expanded = false;
		$('#map-expand').click(function() {
			if (!expanded) {
				$('#map-container').removeClass().addClass('col-lg-12 col-md-12 col-sm-12 col-xs-12');
				$('#period-container').hide();
				$('#count-container').hide();
				$('#yesterday-container').hide();
				$('#chart-container').hide();
				expanded = true;
			}else{
				$('#map-container').removeClass().addClass('col-lg-4 col-md-4 col-sm-12 col-xs-12');
				$('#period-container').show();
				$('#count-container').show();
				$('#yesterday-container').show();
				$('#chart-container').show();
				expanded = false;
			}
		});
	}
})