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
					console.log(self.domains.toJSON());
					self.domains.forEach(function(domain) {
						if (self.domain == domain.get('name')) {
							console.log(domain.get('name'));

							self.getInfo(domain.get('counting_site'));
						}
					});
				}
			});
		},

		getInfo: function(countingSite) {

			var counterArray = [];

			var i = 0;

			var self = this;

			countingSite.forEach(function(id) {

				var url = "https://api.eco-counter-tools.com/v1/h7q239dd/counting_site/" + id;

				var counter = new Counter();

				counter.url = url;

				counter.fetch({
					success: function() {
						counterArray.push(counter.toJSON());

						i += 1;

						if (i == countingSite.length) {
							var counters = new CounterList(counterArray);
							self.showBackground(counters);
						}
					}
				});
			});
		},

		showBackground: function(counters) {
			var map = new Background({collection: counters});
			Main.root.showChildView('mapCanvas', map);
		}
	});

	MyApp.on('start', function() {
		Main.controller = new Main.Controller();
		Main.controller.start();
	});
});