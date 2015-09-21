PeriodItemView = Backbone.Marionette.ItemView.extend({
	template: "#period_template",

	events: {
		"change #date_begin": "refreshChart",
		"change #date_end": "refreshChart",
		"click #hour_button": "clickHour",
		"click #day_button": "clickDay",
		"click #week_button": "clickWeek",
		"click #month_button": "clickMonth",
		"click #download_button": "clickDownload"
	},

	tagName: "div",
	className: "col-lg-12 col-md-12 col-sm-12 col-xs-12",
	id: "period-col",

	initialize: function() {
		_.bindAll(this, 'refreshChart');
		_.bindAll(this, 'render');

		Backbone.globalEvent.on('changeLang', this.render, this);
	},

	refreshChart: function() {

		Backbone.globalEvent.trigger('refresh', 4);

		this.model.set({
			begin: $('#date_begin').val(),
			end: $('#date_end').val()
		});
	},

	clickHour: function() {
		$('#hour_button').addClass('active');

		$('#day_button, #week_button, #month_button').removeClass('active');

		Backbone.globalEvent.trigger('refresh', 3);	
	},

	clickDay: function() {
		$('#day_button').addClass('active');

		$('#hour_button, #week_button, #month_button').removeClass('active');

		Backbone.globalEvent.trigger('refresh', 4);
	},

	clickWeek: function() {
		$('#week_button').addClass('active');

		$('#hour_button, #day_button, #month_button').removeClass('active');

		Backbone.globalEvent.trigger('refresh', 5);
	},

	clickMonth: function() {
		$('#month_button').addClass('active');

		$('#hour_button, #day_button, #week_button').removeClass('active');

		Backbone.globalEvent.trigger('refresh', 6);
	},

	clickDownload: function() {
		try {
			var data = this.model.get('data').toJSON();

			var CSV = "";

			CSV += this.model.get('name') + '\r\n\n';

			// labels
			var keys = _.keys(data[0]);

			var row = keys[0] + "," + keys[1];

			CSV += row + '\r\n';

			// data
			for (var i=0; i<data.length; i++) {
				var row = "";
				for (var index in data[i]) {
					if (index != "status" && index != "timestamp") {
						row += data[i][index] + ',';
					}
				}
				row += '\r\n';

				CSV += row;
			}
		}
		// if err, than data comes from a counter with multiple channels
		catch(err) {
			var data = this.model.get('data');
			var names = [];
			var jsonData = [];

			for (var i=0; i<data.length; i++) {
				jsonData.push(data[i].data.toJSON());
				names.push(data[i].name);
			}

			var CSV = "";

			CSV += this.model.get('name') + '\r\n\n';

			// channel names
			var row = "";
			for (var i=0; i<names.length; i++) {
				row += names[i] + ", ,";
			}

			CSV += row + '\r\n';
			// data. First For is for number of rows = number entries
			
			for (var i=0; i<jsonData[0].length; i++) {
				var row = "";
				// Second For is for number of counter;
				for (var j=0; j<jsonData.length; j++) {
					// Third For is for number of columns per counter eg. Date, Comptage and exclude status and timestamp
					for (var index in jsonData[j][i]) {
						if (index != "status" && index != "timestamp") {
							row += jsonData[j][i][index] + ',';
						}
					}
				}
				CSV += row + '\r\n';
			}			
		}

		var fileName = "counter_data";

		var uri = 'data:text/csv;charset=utf-8,' + escape(CSV);

		var link = document.createElement('a');
		link.href = uri;

		link.style = "visibility:hidden";
		link.download = fileName + ".csv";

		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	},

	onShow: function() {
		$('.input-group.date').datepicker({
		    format: "yyyy-mm-dd",
		    autoclose: true
		});
	},

	onRender: function() {
		this.$el.i18n();

		$('.input-group.date').datepicker({
		    format: "yyyy-mm-dd",
		    autoclose: true,
		    orientation: "top auto",
		    keyboardNavigation: false
		});
	},

	onDestroy: function() {
		Backbone.globalEvent.unbind('changeLang', this.render, this);
	}
});