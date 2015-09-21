ChartItemView = Backbone.Marionette.ItemView.extend({
	template: "#chart_template",

	tagName: "div",
	className: "col-lg-12 col-md-12 col-sm-12 col-xs-12",
	id: "chart-col",

	initialize: function(options) {

		this.counter = options.counter;
		_.bindAll(this, 'checkChannels');
		Backbone.globalEvent.on('refresh', this.checkChannels);
	},

	onShow: function() {
		//this.getData(4);
		this.checkChannels(4);
	},

	checkChannels: function(step) {
		var channels = new ChannelCollection();

		channels.url = "https://api.eco-counter-tools.com/v1/" + "h7q239dd" + "/counting_site/channels/"
    						+ this.counter.get('id');

    	var self = this;

    	channels.fetch({
    		success: function() {
    			if (channels.length > 0) {
    				self.channelsFetch(channels, step);
    			}else{
    				self.channelFetch(step);
    			}
    		}
    	});
	},

	channelFetch: function(step) {
	},

	channelsFetch: function(channels, step) {
		var self = this;
		this.step = step;
		var series = [];
		var count = 0;
		var yesterdayDate = moment().subtract(1, 'd').startOf('d').format('YYYYMMDD');
		var yesterday = 0;
		var csvData = [];

		var colors = ['#D4D600', '#828184', '#24B7D2', '#98C21D']

		var begin = moment($('#date_begin').val()).format('YYYYMMDD');
		var end = moment($('#date_end').val()).format('YYYYMMDD');

		this.channelsFetchHelper(channels, series, begin, end, colors, count, yesterdayDate, yesterday, csvData, self);
	},

	channelsFetchHelper: function(channels, series, begin, end, colors, count, yesterdayDate, yesterday, csvData, self) {
		var channel = channels.shift();
		var color = colors.shift();

		if (channel) {
			var dataCollection = new DataCollection();

			dataCollection.url = "https://api.eco-counter-tools.com/v1/" + "h7q239dd" + "/data/periode/" 
							+ channel.get("id")
							+ '?begin=' + begin
							+ '&end=' + end
							+ '&step=' + self.step;

			dataCollection.fetch({
				success: function() {
					var serie = {};
					var data = [];
					var csvSerie = {};

					dataCollection.forEach(function(datum) {
						data.push([moment.utc( datum.get('date'), "YYYY-MM-DD HH:mm:ss" ).unix() * 1000, datum.get('comptage')])
						count += datum.get('comptage');
					});

					var yesterdayModel = new Backbone.Model();

					yesterdayModel.url = "https://api.eco-counter-tools.com/v1/" + "h7q239dd" + "/data/periode/" 
							+ channel.get("id")
							+ '?begin=' + yesterdayDate
							+ '&end=' + yesterdayDate
							+ '&step=' + self.step;

					yesterdayModel.fetch({
						success: function () {
							yesterday += yesterdayModel.get('0').comptage;

							serie.name = channel.get('name');
							serie.data = data;
							serie.color = color;
							
							csvSerie.name = channel.get('name');
							csvSerie.data = dataCollection;
						
							series.push(serie);
							csvData.push(csvSerie);

							self.channelsFetchHelper(channels, series, begin, end, colors, count, yesterdayDate, yesterday, csvData, self);
						}
					});

					
				}
			});

		}else{
			self.makeChart(series);
			self.counter.set({'count': count, 'yesterday': yesterday, data: csvData});
		}
	},

	/*getData: function(step) {

		var step = step;

		var dataCollection = new DataCollection();

		var begin = moment($('#date_begin').val()).format('YYYYMMDD');
		var end = moment($('#date_end').val()).format('YYYYMMDD');

		dataCollection.url = "https://api.eco-counter-tools.com/v1/" + "h7q239dd" + "/data/periode/" 
								+ this.counter.get('id')
								+ '?begin=' + begin
								+ '&end=' + end
								+ '&step=' + step;

		var self = this;

		dataCollection.fetch({
			success: function() {

				var count = 0;

				for (var i=0; i<dataCollection.length; i++) {
					count += dataCollection.at(i).get('comptage');
				}

				var yesterdayDate = moment().subtract(1, 'd').startOf('d').format('YYYY-MM-DD');

				var yesterday = dataCollection.find(function(datum) {
						return moment(datum.get('date')).format('YYYY-MM-DD') == yesterdayDate;
					});

				if (yesterday) {
					self.counter.set({'yesterday': yesterday.get('comptage')});
				}

				self.counter.set({'data': dataCollection, 'count': count});

				var data = [];

				if (dataCollection.length > 0) {
					dataCollection.each(function(datum) {
						data.push([moment.utc( datum.get('date'), "YYYY-MM-DD HH:mm:ss" ).unix() * 1000, datum.get('comptage')]);
					});

				}

				self.makeChart(data);
			}
		});
	},*/

	makeChart: function(series) {

		$('#chart-col').highcharts('StockChart', {
            chart: {
                type: 'column'
            },

            xAxis: {
	            type: 'datetime',
	            //minRange: 3600* 1000 
	        },

            rangeSelector: {
                selected: 4,
			    inputEnabled: false,
			    buttonTheme: {
			        visibility: 'hidden'
			    },
			    labelStyle: {
			        visibility: 'hidden'
			    }
            },

            tooltip: {

            },

            plotOptions: {
            	column: {
            		stacking: 'normal',
            	}
            },

            legend: {
            	enabled: true,
            	aligh: 'right',
            	layout: 'vertical',
            	verticalAlign: 'top'
            },

            title: {
                style: {
                	display: 'none'
                }
            },

            series: series
        });
	}
});