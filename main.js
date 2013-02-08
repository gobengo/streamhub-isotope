/**
 * @module IsotopeView
 * @author Benjamin Goering - https://github.com/gobengo
 */
define('IsotopeView', function(require) {
var Backbone = require('backbone'),
    Mustache = require('mustache'),
    isotope = require('isotope'),
    ContentTemplate = require('text!streamhub-backbone/templates/Content.html'),
    ContentView = require('streamhub-backbone/views/ContentView'),
    sources = require('streamhub-backbone/const/sources'),
    _ = require('underscore');

/**
 * IsotopeView, a pluggable View for creating tiled layouts and media walls
 * @constructor
 * @class IsotopeView
 * @alias module:IsotopeView
 * @augments Backbone.View
 * @param {Object} opts - Options
 * @param {Collection} opts.collection - A `Hub.Collection` of `Content`
 * @param {Object} opts.contentViewOptions - Options to be passed to any `Content` Views this instantiates
 *        This is useful for passing custom templates for Content
 * @param {Object} opts.sources - An object to configure stuff on a per-source basis
 *        Supports `twitter` and `rss` sub objects with the same opts as this root level
 * @param {Object} opts.isotope - Options to be passed to isotope on instantiation
 */
var IsotopeView = Backbone.View.extend({

    /**
     * initializes an `IsotopeView`, and is called automatically on construction
     * @param {Object} opts - Options to construct with
     * @see module:IsotopeView
     * @protected
     * @todo allow passing custom contentView
     */
    initialize: function (opts) {
        this._contentViewOpts = opts.contentViewOptions || {};
        this._sourceOpts = opts.sources || {};
        this._isotopeOpts = opts.isotope || {};
        this.$el.addClass(this.className);
        this.$el.hide();

        this.initialCount = 0;
        this.initialNumToDisplay = opts.initialNumToDisplay || null;
        this.initialDataItems = [];
        this.finishInitializing = false;

        this.collection.on('add', this._addItem, this);
        this.collection.on('initialDataLoaded', this.render, this);
    },

    /**
     * @property {String} The default HTML Element to use for this View
     * @default hub-IsotopeView
     */
    tagName: "div",

    /**
     * @property {String} The CSS class that should be added to this View's containing Element
     * @default hub-IsotopeView
     */
    className: "hub-IsotopeView",

    /**
     * Render the initial display of the Collection, including
     *     any initially set Content
     * @public
     */
    render: function () {
        var self = this;

        if (this.initialNumToDisplay) {
            self.$el.imagesLoaded(function() {
                // Add remaining initial data items
                self.finishInitializing = true;
                if (self.initialDataItems) {
                    setTimeout(function() {
                        for(var i=0; i < self.initialDataItems.length; i++) {
                            var insertedEl = self._insertItem(self.initialDataItems[i]);
                            self.$el.isotope('appended', $(insertedEl));
                        }
                    }, 1500);
                }   
             });
        }
        
        // init isotope plugin
        this.$el.isotope(_({
            itemSelector: '.hub-item',
            isAnimated: true,
            getSortData : {
                index : function( $item ) {
                    return $item.index();
                }
            },
            sortBy : 'index'
        }).extend(this._isotopeOpts));

        var self = this;
        // Insert items
        this.collection.forEach(function(item) {
            self._insertItem(item, {});
            if (self.collection.indexOf(item) == self.collection.length-1) {
                self.$el.imagesLoaded(function () {
                   self.$el.isotope('reLayout');
                });
            }
        });
    }
});

/**
Insert a new ContentView into the DOM
@private
@param {Content} item - A Content model */
IsotopeView.prototype._insertItem = function (item, opts) {
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
            return _(configuredOpts).extend(self._sourceOpts.twitter||{});
        }
        if (content.get('source')==sources.RSS) {
            return _(configuredOpts).extend(self._sourceOpts.rss||{});
        }
        return configuredOpts;
    }

    var cv = new ContentView(_.extend({
        model: item,
        el: newItem
    }, _getContentViewOpts(item)));

    newItem
      .addClass('hub-item')
      .attr('data-hub-contentId', json.id);

    if (this.collection._initialized && !this.finishInitializing) {
        this.$el.prepend(newItem);
    } else {
        this.$el.append(newItem);
    }
    return newItem;
};

/**
Add Content to the IsotopeView
@private
@param {Content} item - A Content model */
IsotopeView.prototype._addItem = function(item, opts) {
    if (!this.collection._started && this.initialNumToDisplay != null) {
        if (this.initialCount == this.initialNumToDisplay) {
            this.initialCount++;
            return;
        } else if (this.initialCount > this.initialNumToDisplay) {
            this.initialDataItems.push(item);
            return;
        }
    }

    var $newItem = this._insertItem(item, opts);

    if (!$newItem) {
        console.log("DefaultView: Could not create a hub item element to add to container");
        return;
    }
    if (this.collection._started && this.collection._initialized) {
        var that = this;
        $newItem.imagesLoaded(function () {
            that.$el.isotope( 'reloadItems' ).isotope({ sortBy: 'original-order' });
        });
    }
    this.initialCount++;
};

return IsotopeView;
});
