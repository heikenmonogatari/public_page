var InfoboxItemView = Backbone.Marionette.ItemView.extend({

	template: "#infobox_template",

	events: {
		"click .close" : "closeInfobox"
	},

	initialize: function(options) {
		this.map = options.map;
	},

	onRender: function() {
		var self = this;

		var dataCollection = new DataCollection();

		dataCollection.url = "https://api.eco-counter-tools.com/v1/" + "h7q239dd" + "/data/periode/" 
							+ this.model.get('id')
							+ '?begin=' + moment().subtract(1, 'M').format('YYYYMMDD')
							+ '&end=' + moment().subtract(1, 'd').format('YYYYMMDD')
							+ '&step=' + 4;

		dataCollection.fetch({
			success: function() {

				var serialized_data = [];

				dataCollection.forEach(function(datum) {
					serialized_data.push({x: moment.utc( datum.get('date'), "YYYY-MM-DD HH:mm:ss" ).unix() * 1000, y: datum.get('comptage')})
				});

				self.$('.chart_container').highcharts({
					chart: {
			        	type: 'column',
			        	backgroundColor: "#282828"
			        },
			        title: {
			            text: "Daily Counts",
			            style: {
			            	color: "#d4d600"
			            }
			        },
			        subtitle: {
			        	text: moment().subtract(1, 'M').format('YYYY-MM-DD') + " to " + moment().subtract(1, 'd').format('YYYY-MM-DD'),
			        	style: {
			            	color: "#d4d600"
			            }
			        },
			        xAxis: {
			            type: 'datetime',
			            minRange: 24 * 3600000,
			            labels: {
				       		enabled: false
					    },
					    minorTickLength: 0,
					    tickLength: 0
			        },
			        yAxis: {
			        	labels: {
				       		enabled: true
					    },
					    minorTickLength: 0,
					    tickLength: 0,
					    title: {
					    	text: null
					    }
			        },
			        tooltip: {
			        	formatter: function() {
			        		return moment(this.x).format('YYYY-MM-DD') + ": " + this.y;
			        	}
			        },
			        legend: {
			            enabled: false
			        },
			        plotOptions: {
			            series: {
			            	animation: false,
			            	borderWidth: 0 
			            }	         
			        },
			        series: [{
			            data: serialized_data,
			            pointWidth: 2,
			            color: "#d4d600"
			        }]
				})
			}
		});
	
		$(function() {
			$("#chart-area").draggable({
				containment: "parent"
			});
		});

		this.$el.hide().fadeIn();

	},

	closeInfobox: function() {
		var self = this;

		this.$el.fadeOut(function(){
			$(this).remove();
		}); 
	},

	onShow: function() {
		var photos = this.model.get('photo');

		$('#chart-area').children(":first").append('<div id="myCarousel" class="carousel slide" data-ride="carousel">')

		$('#myCarousel').append('<ol class="carousel-indicators">');

		for (var i=0; i<photos.length; i++) {
			if (i == 0) {
				$('.carousel-indicators').append('<li data-target="#myCarousel" data-slide-to="'+ i + '" class="active"></li>');	
			}else{
				$('.carousel-indicators').append('<li data-target="#myCarousel" data-slide-to="'+ i + '" class=""></li>');
			}
		}

		$('#myCarousel').append('<div class="carousel-inner" role="listbox"></div>');

		for (var i=0; i<photos.length; i++) {
			if (i == 0) {
				$('.carousel-inner').append('<div class="item active" id="item' + i + '"></div>');
			}else{
				$('.carousel-inner').append('<div class="item" id="item' + i + '"></div>');
			}
			$('#item' + i).append('<img class="photoCarousel" src="' + photos[i] + '">');
		}

		$('#myCarousel').append('<a class="left carousel-control" href="#myCarousel" role="button" data-slide="prev">');
		$('.left').append('<span class="glyphicon glyphicon-chevron-left" aria-hidden="true"></span><span class="sr-only">Previous</span>');

		$('#myCarousel').append('<a class="right carousel-control" href="#myCarousel" role="button" data-slide="next">');
		$('.right').append('<span class="glyphicon glyphicon-chevron-right" aria-hidden="true"></span><span class="sr-only">Next</span>');
	}
});