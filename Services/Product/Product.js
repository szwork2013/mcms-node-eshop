module.exports = (function(App){
    var Auth,
        coreServices,
        eshopModels,
        async = require('async'),
        lo = require('lodash');

    function product(){
        this.name = 'Product';
        this.nameSpace = 'Product';

/*        eshopModels = App.serviceProviders.eshop.models;
        Auth =  App.serviceProviders.core.auth;
        coreServices = App.serviceProviders.core.services;*/

    }

    product.prototype.getProduct = function(id,callback){
        var eshop = App.serviceProviders.eshop.models;

        eshop.Product.findOne(id)
            .exec(callback);
    };

    product.prototype.getProducts = function(options,callback){
        var eshop = App.serviceProviders.eshop.models;

        eshop.Product.find()
            .limit(10)
            .sort('-autoID')
            .exec(callback);
    };

    return product;
});