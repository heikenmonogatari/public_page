MyApp.module('Main', function (Main, MyApp, Backbone, Marionette, $, _){

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
							self.showHeader(domain);
							self.showLogos(domain);
							self.getInfo(domain.get('counting_site'));
						}
					});
				}
			});
		},

		showHeader: function(domain) {
			var headerItemView = new HeaderItemView({model: domain});
			Main.root.showChildView('header', headerItemView);
		},

		showLogos: function(domain) {
			Main.root.addRegion("mainHeaderLeft", "#mainHeaderLeft");

			var logos = domain.get('logos');

			if (!logos) {
				logos = ['./logo/3.jpg'];
			}

			var logoArray = [];
				
			for (var i=0; i<logos.length; i++) {
				logoArray.push({logo: logos[i]});
			}

			var logoCollection = new LogoCollection(logoArray);

			var logosCollectionView = new LogosCollectionView({collection: logoCollection});

			Main.root.showChildView('mainHeaderLeft', logosCollectionView);	
		},

		getInfo: function(countingSites) { // Requests are done one after the other

			console.log(countingSites);

			var counterArray = [];

			var self = this;

			this.getInfoHelper(countingSites, counterArray, self);
		},

		getInfoHelper: function(countingSites, counterArray, self) {
			countingSite = countingSites.shift();

			if (countingSite) {
				var url = "https://api.eco-counter-tools.com/v1/" + "h7q239dd" + "/counting_site/" + countingSite.id;

				var counter = new Counter({displayedName: countingSite.name});

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
			}
		},

		showBackground: function(counters) {
			var map = new Background({collection: counters});
			Main.root.showChildView('mapCanvas', map);
		},

		showInfoBox: function(map, counter) {
			var infoboxItemView = new InfoboxItemView({model: counter, map: map});
			Main.root.showChildView('chartArea', infoboxItemView);
		}
	});

	MyApp.on('start', function() {
		Main.controller = new Main.Controller();
		Main.controller.start();
	});

	MyApp.on('markerClick', function(options){
		Main.controller.showInfoBox(options[0], options[1]);
	});
});