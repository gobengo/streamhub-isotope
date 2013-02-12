// # StreamHub Media Wall Example

// Require the config file that tells requirejs where dependency packages are at
require(['requirejs.conf'], function () {

// Require the dependencies
//
// * `fyre` - The Livefyre JavaScript API
// * `streamhub-backbone` - provides the Collection model
// * `streamhub-isotope` - provides an IsotopeView to lay out Content in the Collection
require([
    'fyre',
    'streamhub-backbone',
    'streamhub-isotope'],
function (fyre, Hub, IsotopeView) {
    // keep track of Config separate from instantiation logic
    var Config = {
        el: document.getElementById('hub-media-wall'),
        network: 'livefyre.com',
        siteId: 303818,
        articleId: '172'
    };
    // Load the Livefyre JavaScript SDK
    fyre.conv.load({
        network: Config.network
    }, [{ app: 'sdk'}], function (sdk) {
        // Create the Collection that will store the Content
        var collection = new Hub.Collection(),
        // Create the IsotopeView bound to this Collection
            view = new IsotopeView({
                el: Config.el,
                collection: collection
            });
        // be sure to render the view so it is visible
        view.render();
        // Bind the Collection to a remote Collection in StreamHub
        collection.setRemote({
            sdk: sdk,
            siteId: Config.siteId,
            articleId: Config.articleId
        });
    });
});
});