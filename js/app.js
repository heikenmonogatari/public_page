var App = Backbone.Marionette.Application.extend({
	initialize: function() {
		console.log("App initialization OK");
	}
});

var MyApp = new App();

MyApp.on('start', function() {
	console.log("App started");

	
	MyApp.Main.start();
	overwriteRenderer();

});

$(document).ready(function(){
    // Démarrage de l'application

    // Cursor will show progress on ajax fetch
	$(document).ajaxStart (function() {
		$("body").css("cursor", "progress")
	});

	$(document).ajaxStop (function() {
		$("body").css("cursor", "default")
	});

	i18n.init({
			lng: "en-US", 
			useDataAttrOptions: true
	}, function() {
		MyApp.start();	
	});
});

function overwriteRenderer() {
	var render = Marionette.Renderer.render;

	 Marionette.Renderer.render = function (template, data){

    data = _.extend(data, {_t: i18n.t});

    return render(template, data);
  };
}