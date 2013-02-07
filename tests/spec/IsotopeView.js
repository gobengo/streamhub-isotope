define([
    'jasmine-jquery',
    'streamhub-isotope',
    'streamhub-backbone'],
function (jasmine, IsotopeView, Hub) {
describe('IsotopeView', function () {
    it ("Can be constructed with empty options", function () {
        var view = new IsotopeView({});
        expect(view).toBeDefined();
    });
    it ("Can be constructed with only a Hub.Collection", function () {
        var view = new IsotopeView({
            collection: new Hub.Collection()
        });
        expect(view).toBeDefined();
    });
    it ("Can be constructed with an el", function () {
        setFixtures('<div id="hub-IsotopeView"></container>');  
        var view = new IsotopeView({
            el: $('#hub-IsotopeView')
        });
        expect(view).toBeDefined();
    });
    it ("Can be constructed with an el and collection", function () {
        var view = new IsotopeView();
        expect(view).toBeDefined();
    });
    it ("Can have tests run", function () {
        expect(true).toBe(true);
    });
    describe ("when .collection.setRemote is called after construction", function () {
        it ("should display data from the remote Collection", function () {
            return false;
        });
    });
    it("Can do HTML tests",function(){  
        setFixtures('<div id="hub"></container>');  
        $('#hub')
            .append('<li>So</li>')
            .append('<li>So</li>');
        expect($('#hub li').length).toBe(2);  
    });
}); 
});