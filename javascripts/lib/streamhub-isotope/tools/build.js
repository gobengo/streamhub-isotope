({
    baseUrl: "..",
    paths: {
        jquery: 'components/jquery/jquery',
        underscore: 'components/underscore/underscore',
        backbone: 'components/backbone/backbone',
        "streamhub-isotope": "main",
        mustache: 'components/mustache/mustache',
        text: 'components/requirejs-text/text',
        isotope: 'components/isotope/jquery.isotope',
    },
    packages: [{
        name: 'streamhub-backbone',
        location: 'components/streamhub-backbone'
    }],
    shim: {
        'backbone': {
            deps: ['underscore', 'jquery'],
            exports: 'Backbone'
        },
        'underscore': {
            exports: '_'
        }
    },
    name: "tools/almond",
    out: "streamhub-isotope.almond.js",
    include: ['streamhub-isotope'],
})
