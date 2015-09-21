MyApp.module('Main', function (Main, MyApp, Backbone, Marionette, $, _){

	Backbone.globalEvent = _.extend({}, Backbone.Events);

	Main.Router = Marionette.AppRouter.extend({
		appRoutes: {
			"domain/:domain": "showPage"
		}
	});

	Main.Controller = Marionette.Controller.extend({
		start: function() {
			console.log("MyApp Controller start...");

			Main.controller.router = new Main.Router({
				controller: Main.controller
			});

			Backbone.history.start();

			Main.root = new MyApp.Layout.Root();
		},

		showPage: function(domain) {

			this.domain = domain;

			this.domains = new DomainList();

			this.domains.url = "./test.json";

			var self = this;

			this.domains.fetch({
				success: function() {
					self.domains.forEach(function(domain) {
						if (self.domain == domain.get('name')) {

							// Set background image
							$('body').css('background-image', 'url("./image/background2.jpg")');

							self.showHeader(domain);
							self.showLogos(domain);
							self.getInfo(domain.get('counting_site'));
							self.showLang();
						}
					});
				}
			});
		},

		showHeader: function(domain) {
			var headerItemView = new HeaderItemView({model: new Backbone.Model(domain.get('displayedName'))});
			Main.root.showChildView('header', headerItemView);
		},

		showLogos: function(domain) {
			Main.root.addRegion("logoArea", "#logo-area");

			var logos = domain.get('logos');

			if (!logos) {
				logos = ['./logo/3.jpg'];
			}

			var logoArray = [];
				
			for (var i=0; i<logos.length; i++) {
				logoArray.push({logo: logos[i]});
			}

			var logoCollection = new LogoCollection(logoArray);

			var logosItemView = new LogosItemView({collection: logoCollection});

			Main.root.showChildView('logoArea', logosItemView);	
		},

		getInfo: function(countingSites) { // Requests are done one after the other

			var counterArray = [];

			var self = this;

			this.getInfoHelper(countingSites, counterArray, self);
		},

		getInfoHelper: function(countingSites, counterArray, self) {
			countingSite = countingSites.shift();

			if (countingSite) {
				
				var url = "https://api.eco-counter-tools.com/v1/" + "h7q239dd" + "/counting_site/" + countingSite.id;

				var counter = new Counter({displayedName: countingSite.displayedName});

				counter.url = url;

				counter.fetch({
					success: function() {
						counterArray.push(counter.toJSON());
						self.getInfoHelper(countingSites, counterArray, self);
					}
				});
			}else{
				var counters = new CounterList(counterArray);
				self.showBackground(counters);
				//self.showSummaryHeader(counters);
			}
		},

		showLang: function() {
			Main.root.addRegion("languageArea", "#language-area");
			var lang = new LangItemView();
			Main.root.showChildView('languageArea', lang);
		},	

		showBackground: function(counters) {
			var map = new Background({collection: counters});
			Main.root.showChildView('mapContainer', map);
		},

		showSummaryHeader: function(counters) {

			function getData() {
				var self = this;
				var i = 0;

				var clonedCollection = new Backbone.Collection(counters.toJSON());

				getDataHelper(clonedCollection, i, self);
			};

			function getDataHelper(collection, i ,self) {
				var counter = collection.shift();

				if (counter) {
					var dataCollection = new DataCollection();

					dataCollection.url = "https://api.eco-counter-tools.com/v1/" + "h7q239dd" + "/data/periode/" 
									+ counter.get('id')
									+ '?begin=' + moment().subtract(1, 'M').format('YYYYMMDD')
									+ '&end=' + moment().subtract(1, 'd').format('YYYYMMDD')
									+ '&step=' + 4;

					dataCollection.fetch({
						success: function() {
							counters.at(i).set({'data': dataCollection});
							i += 1;
							getDataHelper(collection, i, self);
						}
					});
				}else{
					getTotal(counters);
				}
			};

			function getTotal(counters) {
				counters.forEach(function(counter) {
					var data = counter.get('data');
					var total = 0;
					data.forEach(function(datum) {
						total += datum.get('comptage');
					});
					counter.set({'total': total});
					counter.set({'average': total/data.length})
				});

				findMaxes(counters);
			};

			function findMaxes(counters) {
				var max1 = 0, max2 = 0, max3 = 0;
				var id1 = "", id2 = "", id3 = "";

				var totalCount = 0;

				var totalAverageCount = 0;
				var nbCounter = 0;

				counters.forEach(function(counter){
					if (counter.get('total') > max1) {
						max3 = max2;
						id3 = id2;

						max2 = max1;
						id2 = id1;

						max1 = counter.get('total');
						id1 = counter.get('id');
					}else if (counter.get('total') > max2) {
						max3 = max2;
						id3 = id2;

						max2 = counter.get('total');
						id2 = counter.get('id');
					}else if(counter.get('total') > max3) {
						max3 = counter.get('total');
						id3 = counter.get('id');
					}

					if (counter.get('total')) {
						totalCount += counter.get('total');
					}

					if(counter.get('average')) {
						totalAverageCount += counter.get('average');
						nbCounter += 1;
					}
				});

				var maxModel = new Backbone.Model({
					"total": totalCount,
					"average": (totalAverageCount/nbCounter).toFixed()
				});

				var summaryHeaderItemView = new SummaryHeaderItemView({model: maxModel});
				Main.root.showChildView('summaryHeader', summaryHeaderItemView);
			};

			getData();
		},

		showPeriodBox: function(counter) {
			counter.set({
				begin: moment().subtract(6, 'M').format('YYYY-MM-DD'),
				end: moment().subtract(1, 'd').format('YYYY-MM-DD')
			});

			var periodItemView = new PeriodItemView({model: counter});
			Main.root.showChildView('periodContainer', periodItemView);
		},

		showCountBox: function(counter) {
			var countItemView = new CountItemView({model: counter});
			Main.root.showChildView('countContainer', countItemView);
		},

		showYesterdayBox: function(counter) {
			var yesterdayItemView = new YesterdayItemView({model: counter});
			Main.root.showChildView('yesterdayContainer', yesterdayItemView);
		},

		showChartBox: function(counter) {
			var chartItemView = new ChartItemView({counter: counter});
			Main.root.showChildView('chartContainer', chartItemView);
		}		
	});

	MyApp.on('start', function() {
		Main.controller = new Main.Controller();
		Main.controller.start();
	});

	MyApp.on('markerClick', function(options){
		$('#period-container').show();
		$('#count-container').show();
		$('#yesterday-container').show();
		$('#chart-container').show();
		Main.controller.showPeriodBox(options[1]);
		Main.controller.showChartBox(options[1]);
		Main.controller.showCountBox(options[1]);
		Main.controller.showYesterdayBox(options[1]);
	});
});