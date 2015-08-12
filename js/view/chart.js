ChartItemView = Backbone.Marionette.ItemView.extend({
	template: "#chart_template",

	tagName: "div",
	className: "col-lg-12 col-md-12 col-sm-12 col-xs-12",
	id: "chart-col",

	initialize: function(options) {

		this.counter = options.counter;
		_.bindAll(this, 'getData');
		Backbone.globalEvent.on('refresh', this.getData);
	},

	onShow: function() {
		this.getData(4);
	},

	getData: function(step) {

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
	},

	makeChart: function(data) {

		$('#chart-col').highcharts('StockChart', {
            chart: {
                alignTicks: false
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

            title: {
                style: {
                	display: 'none'
                }
            },

            series: [{
            	type: 'column',
            	name: 'Counts',
            	data: data
            }]
        });
	}
});