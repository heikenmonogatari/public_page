MyApp.module('Main', function (Main, MyApp, Backbone, Marionette, $, _){

	/*Main.Router = Marionette.AppRouter.extend({
		appRoutes: {
			"domain/:domain": "showPage"
		}
	});*/

	Main.Controller = Marionette.Controller.extend({
		start: function() {
			console.log("MyApp Controller start...");

			/*Main.controller.router = new Main.Router({
				controller: Main.controller
			});

			Backbone.history.start();*/

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
							console.log(domain.get('name'));

							self.myModel = domain;

							self.showTitle();
						}
					});
				}
			});
		},

		showTitle: function() {
			var titleView = new TitleView({model: this.myModel});
			Main.root.showChildView('title', titleView);
		}
	});

	MyApp.on('start', function() {
		Main.controller = new Main.Controller();
		Main.controller.start();
	});
});