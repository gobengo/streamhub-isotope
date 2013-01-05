define(function(require) {
var Backbone = require('backbone'),
	Mustache = require('mustache'),
	isotope = require('isotope'),
	ContentTemplate = require('text!streamhub-backbone/templates/Content.html'),
	ContentView = require('streamhub-backbone/views/ContentView');

var MasonryView = Backbone.View.extend({
	tagName: "div",
	className: "hub-IsotopeView",
	events: {
		'all': function () { console.log('MasonryView event', arguments); }
	},
	initialize: function (opts) {
        this.$el.addClass(this.className);
        this.$el.isotope({
			itemSelector: '.hub-item',
			isAnimated: true,
			getSortData: {
				id: function ($el) {
					return $el.attr('data-hub-contentId');
				},
				bodyLength: function ($el) {
					return $el.find('.hub-body-html').text().length;
				}
			}
		});
		this.render();
		this.collection.on('add', this._addItem, this);
	},
	render: function () {
		var self = this;
		this.collection.forEach(function(item) {
			self._insertItem(item, {})
		});
        this.$el.imagesLoaded(function () {
           self.$el.isotope('reLayout'); 
        });
	}
});

MasonryView.prototype._insertItem = function (item, opts) {
	var newItem = $(document.createElement('div')),
		json = item.toJSON();

	if ( ! json.author) {
        // TODO: These may be deletes... handle them.
        console.log("DefaultView: No author for Content, skipping");
        return;
    }

	// Annotate for avatar filtering
	if ( ! json.author.avatar) {
		json.author.avatar = this.defaultAvatarUrl;
	} else {
		newItem.attr('data-hub-hasavatar', '');
	}
	// Annotate for source filtering
	newItem.attr('data-hub-source-id', item.get('sourceId'));

	var cv = new ContentView({
		model: item,
		el: newItem,
	});

	newItem
	  .addClass('hub-item')
	  .attr('data-hub-contentId', json.id)

	this.$el.append(newItem);
	return newItem;
}
MasonryView.prototype._addItem = function(item, opts) {
	var $newItem = this._insertItem(item, opts);
    if ($newItem) {
	    var that = this;
		$newItem.imagesLoaded(function () {
	        that.$el.isotope('insert', $newItem, true);
	    });
    }
};

MasonryView.prototype._addItem

MasonryView.prototype.go = function () {

}

return MasonryView;
});
