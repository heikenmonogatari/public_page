CountItemView = Backbone.Marionette.ItemView.extend({
	template: "#count_template",

	tagName: "div",
	className: "col-lg-12 col-md-12 col-sm-12 col-xs-12",
	id: "count-col",

	modelEvents: {
		'change:count': 'render'
	},

	initialize: function() {
		_.bindAll(this, 'render');
		Backbone.globalEvent.on('changeLang', this.render, this);
	},

	onRender: function() {
		this.$el.i18n();
	},

	onDestroy: function() {
		Backbone.globalEvent.unbind('changeLang', this.render, this);
	}
});