StreamHub-Isotope is a pluggable View for use with [StreamHub-Backbone](http://gobengo.github.com/streamhub-backbone/). It will use the [jQuery Isotope](https://github.com/desandro/isotope) plugin to lay out Content for a tiled display.

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

# Documentation

There is HTML documentation in the `docs/` directory.
