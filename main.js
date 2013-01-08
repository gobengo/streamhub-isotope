define(function(require) {
var Backbone = require('backbone'),
	Mustache = require('mustache'),
	isotope = require('isotope'),
	ContentTemplate = require('text!streamhub-backbone/templates/Content.html'),
	ContentView = require('streamhub-backbone/views/ContentView'),
	sources = require('streamhub-backbone/const/sources'),
    _ = require('underscore');

var MasonryView = Backbone.View.extend({
	tagName: "div",
	className: "hub-IsotopeView",
	events: {
		'all': function () { console.log('MasonryView event', arguments); }
	},
	initialize: function (opts) {
		this._contentViewOpts = opts.contentViewOptions || {};
		this._sourceOpts = opts.sources || {};
        this._isotopeOpts = opts.isotope || {};
        this.$el.addClass(this.className);
		this.render();
		this.$el.isotope(_({
			itemSelector: '.hub-item',
			isAnimated: true,
		}).extend(this._isotopeOpts));
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
	var self = this,
	    newItem = $(document.createElement('div')),
		json = item.toJSON();

	if ( ! json.author) {
        // TODO: These may be deletes... handle them.
        console.log("DefaultView: No author for Content, skipping");
        return;
    }

	// Annotate for source filtering
	newItem.attr('data-hub-source-id', item.get('sourceId'));

	function _getContentViewOpts (content) {
		var opts = {},
			configuredOpts = _(opts).extend(self._contentViewOpts),
			perSourceOpts;
		if (content.get('source')==sources.TWITTER) {
			return _(configuredOpts).extend(self._sourceOpts['twitter']||{});
		}
		if (content.get('source')==sources.RSS) {
			return _(configuredOpts).extend(self._sourceOpts['rss']||{});
		}
		return configuredOpts;
	}

	var cv = new ContentView(_.extend({
		model: item,
		el: newItem
	}, _getContentViewOpts(item)));

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
