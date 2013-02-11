StreamHub-Isotope is a pluggable View for use with [StreamHub-Backbone](http://gobengo.github.com/streamhub-backbone/). It will use the [jQuery Isotope](https://github.com/desandro/isotope) plugin to lay out Content for a tiled display that are perfect for media wall experiences.

<img src="http://d.pr/i/n6CC+" alt="StreamHub-Isotope Screenshot" height="300px"/>

<img src="http://d.pr/i/3Ilj+" alt="StreamHub-Isotope on Super Bowl Hub" height="300px" />

[Livefyre StreamHub](http://www.livefyre.com/streamhub/) is the web's first Engagement Management System. StreamHub turns your site into a real-time social experience. Curate images, videos, and Tweets from across the social web, right into live blogs, chats, widgets, and dashboards. The world's biggest publishers and brands use StreamHub to power their online Content Communities.

[StreamHub-Backbone](http://gobengo.github.com/streamhub-backbone/) displays Collections of Content in StreamHub Networks. To get your own Network so you can create your own Collections, engage your own community of SSO Users, and curate Content that appeals to your users, [contact Livefyre](http://www.livefyre.com/streamhub/) about subscribing to StreamHub.


# Usage
StreamHub-Isotope presents itself as the `IsotopeView` constructor. It is an extension of Backbone.View, and is instantiated with a `Hub.Collection()`, `el`, and some other options.

    // Load a Livefyre JS App
    fyre.conv.load({
        network: Config.network
    },
    // specifically, the 'sdk' App
    [{app: 'sdk'}],
    
    function loadIsotopeView (sdk) {
        // Create a Collection and a View
        var mediaCollection = new Hub.Collection(),
            wallView = new IsotopeView({
                el: Config.el,
                collection: mediaCollection,
                // load this many items, wait for their
                // images to load, then render the rest
                initialNumToDisplay: 5,
                // Options to pass to jQuery-Isotope
                isotope: {}
            });
            
        // Bind the mediaCollection to a remote source
        mediaCollection.setRemote({
            sdk: sdk,
            siteId: Config.siteId,
                articleId: Config.articleId
            });
        });
    });

# Getting Started

Install npm

Use npm to install this package

    npm install

[Bower](http://twitter.github.com/bower/) is used for dependency management. The npm postinstall script will run `bower install` and put dependencies in `lib/`.

StreamHub-Isotope is written as an [AMD](http://requirejs.org/docs/whyamd.html) module. You will need to use an AMD loader like [RequireJS](http://requirejs.org/) to use it. Add it as a package in your RequireJS config:

    packages: [{
        name: 'streamhub-isotope',
        location: './path/to/streamhub-isotope'
    }]

Then you can use it like:

    require(['streamhub-isotope'], function (IsotopeView) {
        // Hub some Streams, yo
    })

# Documentation
You can access the API Reference [on GitHub](http://gobengo.github.com/streamhub-isotope/docs)

The API reference also lives in the `docs/` directory. You can view them in your browser with:

    open docs/index.html

You can re-build the documentation using:

    npm run-script doc

# Tests
Behavior tests are included in the `tests/spec` directory. You can access an online test runner for the latest release [on GitHub](http://gobengo.github.com/streamhub-isotope/tests).

You can also run the tests via:

    npm test