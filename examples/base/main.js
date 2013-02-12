require(['requirejs.conf'], function () {
require([
	'fyre',
	'streamhub-backbone',
	'streamhub-isotope'],
function (fyre, Hub, IsotopeView) {
	var Config = {
		el: document.getElementById('hub-media-wall'),
		network: 'livefyre.com',
		siteId: 303818,
		articleId: '172'
	};

	fyre.conv.load({
		network: Config.network
	}, [{ app: 'sdk'}], function (sdk) {
		var collection = new Hub.Collection(),
			view = new IsotopeView({
				el: Config.el,
				collection: collection
			}).render();
		collection.setRemote({
			sdk: sdk,
			siteId: Config.siteId,
			articleId: Config.articleId
		});
	});
});
});