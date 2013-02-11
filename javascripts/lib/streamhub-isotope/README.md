StreamHub-Isotope is a pluggable View for use with [StreamHub-Backbone](http://gobengo.github.com/streamhub-backbone/). It will use the [jQuery Isotope](https://github.com/desandro/isotope) plugin to lay out Content for a tiled display.

[Livefyre StreamHub](http://www.livefyre.com/streamhub/) is the web's first Engagement Management System. StreamHub turns your site into a real-time social experience. Curate images, videos, and Tweets from across the social web, right into live blogs, chats, widgets, and dashboards. The world's biggest publishers and brands use StreamHub to power their online Content Communities.

StreamHub-Backbone displays Collections of Content in StreamHub Networks. To get your own Network so you can create your own Collections, engage your own community of SSO Users, and curate Content that appeals to your users, [contact Livefyre](http://www.livefyre.com/streamhub/) about subscribing to StreamHub.

![StreamHub-Isotope Screenshot](http://d.pr/i/n6CC+)

# Example Usage

    var app = new Hub({
        sdk: livefyreSdk,
        collection: {
            siteId: "303772",
            articleId: "prod0"
        },
        el: document.getElementById("example"),
        view: IsotopeView
    }).start();

# Using It

[Bower](http://twitter.github.com/bower/) is used for dependency management. You can install the dependencies with

    bower install

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

There is HTML documentation in the `docs/` directory.
