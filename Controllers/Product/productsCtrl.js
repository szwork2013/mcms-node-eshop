module.exports = (function(App,Package){
    var models,
        Auth,
        coreServices,
        adminServices,
        eshopServices,
        eshopModels,
        lo = App.lodash,
        async = require('async'),
        Loader = new App.EagerLoader();
        var relationships = {};


    function productsCtrl(){
        this.name = 'productsCtrl';
        this.nameSpace = 'Product';
        eshopModels = App.serviceProviders.eshop.models;
        Auth =  App.serviceProviders.core.auth;
        coreServices = App.serviceProviders.core.services;

        eshopServices = App.serviceProviders.eshop.services;
        relationships = App.serviceProviders.eshop.modelRelationships;
    }

    productsCtrl.prototype.find = function(req,res,next){

        var Products  = new eshopServices.Product();
        var Categories  = new eshopServices.Category();
        var page = parseInt(req.body.page) || 1;
        var limit = 10;//move it to options file
        var filters = req.body.filters || {};
        var options = {
            sort : 'created_at',
            way : '-'
        };
        var Category;

        var asyncObj = {
            products: function (callback) {
                Loader.set(Products).with([
                    relationships.categories,
                    relationships.eshop,
                    relationships.thumb
                ]).
                    exec(Products.find.bind(null, {
                        simplified : true,
                        page: page,
                        limit: limit,
                        sort: options.sort,
                        way: options.way,
                        filters: lo.clone(filters)
                    }), callback);
            },
            count: Products.count.bind(null, lo.clone(filters))
        };
        if (req.body.boot){
            asyncObj.categories = function(callback){
                Categories.all({},callback);//this should become tree
            };
        }

                    asyncObj.tree = function(callback){
         var id = '5464ab231da16c2451033a63';
         Categories.getTree(id,callback);
         }
        async.parallel(asyncObj,function(err,results){
            var totalProducts = results.count || 0;
            var pagination = App.Helpers.Model.pagination(totalProducts,limit,page);
            res.send(lo.merge(results,{pagination : pagination}));
        });



    };

    productsCtrl.prototype.findOne = function(req,res,next){
        var Products  = new eshopServices.Product();
        var Categories  = new eshopServices.Category();
        var asyncObj = {};
        if (req.body.boot){
            asyncObj.categories = function(callback){
                Categories.all({},callback);//this should become tree
            };
        }

        asyncObj.tree = function(callback){
            var id = '5464ab231da16c2451033a63';
            Categories.getTree(id,callback);
        }

        asyncObj.product = function(callback){//call a service instead
            Loader.set(Products).with([
                relationships.categories,
                relationships.ExtraFields,
                //relationships.eshop,
                relationships.upselling,
                relationships.related,
                relationships.thumb,
                relationships.images
            ]).
                exec(Products.findOne.bind(null, req.body.productID,null),callback);
            //Products.getProduct({permalink: req.params.permalink },{},callback);
        };

        async.parallel(asyncObj,function(err,results){
            res.send(results);
        });


    };

    productsCtrl.prototype.update = function(req,res,next){
        var Products  = new eshopServices.Product();

        Products.update(req.body.action,req.body.ids,function(err,count){
            res.send({success : true,numUpdated : count});
        });

    };

    productsCtrl.prototype.updateOne = function(req,res,next){

    };

    return productsCtrl;
});