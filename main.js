/**
 * @module IsotopeView
 * @author Benjamin Goering - https://github.com/gobengo
 */
define(function(require) {
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
        var self = this;
        this._contentViewOpts = opts.contentViewOptions || {};
        this._sourceOpts = opts.sources || {};
        this._isotopeOpts = opts.isotope || {};
        this.$el.addClass(this.className);

        this.initialCount = 0;
        this.initialNumToDisplay = opts.initialNumToDisplay || null;
        this.initialDataItems = [];
        this.finishInitializing = false;

        this.collection.on('add', this._addItem, this);
        this.collection.on('initialDataLoaded', this.render, this);

        setInterval(function () {
            self.relayout();
        }, 2000);
        return this;
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

        this.$el.addClass(this.className);

        // If configured to wait for imagesLoaded after N items
        if (this.initialNumToDisplay) {
            // Whenever all images in the view are loaded
            self.$el.imagesLoaded(function doneWaitingForImages() {
                // We're done waiting
                self.finishInitializing = true;
                if (self.initialDataItems) {
                    // Wait a bit, then insert the rest
                    setTimeout(function() {
                        for(var i=0; i < self.initialDataItems.length; i++) {
                            var insertedEl = self._insertItem(self.initialDataItems[i]);
                            self.$el.isotope('appended', $(insertedEl));
                        }
                    }, 1500);
                }
             });
        }
        
        // Merge standard isotope options with those passed into constructor
        var isotopeOptions = _.extend(this._isotopeOpts, {
            itemSelector: '.hub-item',
            isAnimated: true,
            getSortData : {
                index : function( $item ) {
                    return $item.index();
                }
            },
            sortBy : 'index'
        });
        // Initialize the jQuery-Isotope plugin
        this.$el.isotope(isotopeOptions);
        // Render Items already in the Collection
        this.collection.forEach(function(item) {
            var existingElement = self.getElementByContentId(item.get('id'));
            // Ignore if this Content is already in DOM
            if (existingElement) {
                return;
            }
            self._insertItem(item, {});
            if (self.collection.indexOf(item) == self.collection.length-1) {
                self.$el.imagesLoaded(function () {
                   self.$el.isotope('reLayout');
                });
            }
        });

        return this;
    }
});

IsotopeView.prototype.getElementByContentId = function (contentId) {
    var $elements = this.$el.find('*[data-hub-contentid="'+contentId+'"]');
    if ($elements.length===0) {
        return false;
    }
    return $elements;
};

/**
 * Add Content to the IsotopeView by inserting it in the DOM, then making sure Isotope
 *     lays items out correctly
 * @private
 * @param {Content} item - A Content model
 */
IsotopeView.prototype._addItem = function(item, opts) {
    if (!this.collection._started && this.initialNumToDisplay !== null) {
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
    
    this.initialCount++;
};

/**
 * Insert a new ContentView into the DOM
 * @private
 * @param {Content} item - A Content model
 */
IsotopeView.prototype._insertItem = function (item, opts) {
    var self = this,
        newItem = $(document.createElement('div')),
        json = item.toJSON();
    
    if ( ! json.author) {
        // TODO: These may be deletes... handle them.
        console.log("DefaultView: No author for Content, skipping");
        return;
    }

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
        if (content.get('source')==sources.STREAMHUB) {
            return _(configuredOpts).extend(self._sourceOpts.ugc||{});
        }
        return configuredOpts;
    }

    var cv = new ContentView(_.extend({
        model: item,
        el: newItem
    }, _getContentViewOpts(item)));

    newItem.imagesLoaded(function () {
        self.relayout();
    });

    newItem
      .addClass('hub-item')
      .attr('data-hub-contentId', json.id);

    var colIndex = this.collection.indexOf(item),
        domIndex = this.collection.length - (colIndex + 1),
        nextEl = this.$el.find('> *:nth-child('+ (domIndex+1) +')');

    // If no nextItem or first Item, insert at beginning
    if (nextEl.length === 0 || domIndex === 0) {
        this.$el.prepend(newItem);
    }
    // Else insert before the nextEl
    else {
        newItem.insertBefore(nextEl);
    }

    return newItem;
};

IsotopeView.prototype.relayout = function () {
    this.$el
        .isotope('reLayout')
        .isotope('reloadItems').isotope({ sortBy: 'original-order' });
}

return IsotopeView;
});