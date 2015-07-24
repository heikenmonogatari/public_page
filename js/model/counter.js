// COUNTER MODEL
Counter = Backbone.Model.extend();


// COUNTER COLLECTION
CounterList = Backbone.Collection.extend({
	model: Counter,

	comparator: 'name'
});