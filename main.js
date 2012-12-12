define(function(require) {
var Backbone = require('backbone'),
	Mustache = require('mustache'),
	isotope = require('isotope'),
	ContentTemplate = require('text!streamhub-backbone/templates/Content.html');

var MasonryView = Backbone.View.extend({
	tagName: "div",
	className: "hub-masonry",
	events: {
		'all': function () { console.log('MasonryView event', arguments); }
	},
	initialize: function (opts) {
		this.$el.isotope({
			itemSelector: '.shb-item',
			isAnimated: true,
			layoutMode: 'fitRows',
			getSortData: {
				id: function ($el) {
					return $el.attr('data-hub-contentId');
				},
				bodyLength: function ($el) {
					return $el.find('.shb-content-body').text().length;
				}
			}
			/*
			columnWidth: 100,
			isAnimated: true,
			isFitWidth: true
			*/
		});
		this.render();
		this.collection.on('add', this._addItem, this);
	},
	render: function () {
		var self = this;
		this.$el.addClass(this.className);
		this.collection.forEach(function(item) {
			self._addItem(item, {})
		});
	}
});

MasonryView.prototype._addItem = function(item, opts) {
	console.log('MasonryView._addItem', opts.index, item.toJSON());
	var newItem = $(document.createElement('div')),
		json = item.toJSON();
	if ( ! json.author.avatar) {
		json.author.avatar = this.defaultAvatarUrl;
	} else {
		newItem.attr('data-hub-hasavatar', '');
	}
	newItem
	  .addClass('shb-item')
	  .attr('data-hub-contentId', json.id)
	  .append(Mustache.compile(ContentTemplate)(json))
	this.$el.append(newItem);
	this.$el.isotope('insert', newItem, true);
};

MasonryView.prototype.go = function () {

}

return MasonryView;
});