var InfoboxItemView = Backbone.Marionette.ItemView.extend({

	template: "#infobox_template",

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
			        },
			        title: {
			            text: "HELLO CHART"
			        },
			        xAxis: {
			            type: 'datetime',
			            minRange: 24 * 3600000 
			        },
			        legend: {
			            enabled: false
			        },
			        plotOptions: {
			            area: {
			                lineWidth: 6,
			            },
			            series: {
			            	animation: false
			            }	         
			        },
			        series: [{
			            data: serialized_data,
			            pointWidth: 10
			        }]
				})
			}
		});
	}
});