module.exports = (function(App,Package) {
    var Auth,
        coreServices,
        eshopModels,
        async = require('async'),
        lo = require('lodash'),
        Cart,
        Loader = new App.EagerLoader();
    var relationships = {};


    function Cart() {
        this.name = 'Cart';
        this.nameSpace = 'Shop';
        Cart = Package.Cart;
        eshopModels = Package.models;

    }


    Cart.prototype.add = function(productID,options,callback) {
        relationships = App.serviceProviders.eshop.modelRelationships;
        var Products  = new eshopServices.Product();
        Loader.set(Products).with([
            relationships.eshop,
            relationships.thumb
        ]).
            exec(Products.findById.bind(null,productID,null),function(err,product){
                callback(null,Cart.add({
                    id : product.id,
                    title : product.title,
                    price : product.eshop.price,
                    qty : options.qty || 1,
                    img : product.thumb.thumb.imageUrl
                }));
            });



    };

    Cart.prototype.clear = function(req) {
        Cart.clear(req);
        return true;
    };

    Cart.prototype.removeProduct = function(productID) {
        Cart.remove(productID);
        return true;
    };

    return Cart;
});