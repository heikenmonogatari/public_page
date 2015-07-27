var LogosItemView = Backbone.Marionette.ItemView.extend({

	template: "#logo_template",
	tagName: 'img',

	attributes: function() {
		return {
			"src": this.model.get('logo'),
			"style": "height:150px;width:auto;" 
		}
	}
});

var LogosCollectionView = Backbone.Marionette.CollectionView.extend({
	childView: LogosItemView,

	id: "slides",

	onShow: function() {
		if ($('#slides img').length > 1) {
			$('#slides').slidesjs({
				navigation: {
					active: false
				},
				pagination: {
					active: false
				},
				play: {
					active: true,
					interval: 5000,
					auto: true
				}
			});
		}else{
			$('#slides').show();
		}

	}
});