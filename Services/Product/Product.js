module.exports = (function(App,Package){
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
        eshopModels = Package.models;
    }

    product.prototype.getProduct = function(args,options,callback){


        var searchBy = (typeof args == 'string') ? {id : args} : args;

        eshopModels.Product.findOne(searchBy)
            .exec(callback);
    };

    product.prototype.getProducts = function(options,callback){


        eshopModels.Product.find()
            .limit(10)
            .sort('-autoID')
            .exec(callback);
    };

    return product;
});