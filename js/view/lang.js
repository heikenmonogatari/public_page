LangItemView = Backbone.Marionette.ItemView.extend({
	template: "#lang_template",

	tagName: "div",

	id: "lang-container",

	events: {
		"change #lang_selector" : "changeLang"
	},

	changeLang: function() {
		var lang = $('#lang_selector').val();
		var langCode = "";

		switch (lang) {
			case "1":
				langCode = "en-US";
				break;
			case "2":
				langCode = "fr";
				break;
			case "3":
				langCode = "jp";
				break;
		}

		i18n.setLng(langCode, function() {
			Backbone.globalEvent.trigger('changeLang')
		});
	}

});