module.exports = (function(App,Package){
    var Auth,
        coreServices,
        eshopModels,
        async = require('async'),
        lo = require('lodash'),
        baseItemService = new App.serviceProviders.core.services.Item(Package.models),
        Loader = new App.EagerLoader(),
        categoryService;

    function product(){
        this.name = 'Product';
        this.nameSpace = 'Product';

/*        eshopModels = App.serviceProviders.eshop.models;
        Auth =  App.serviceProviders.core.auth;
        coreServices = App.serviceProviders.core.services;*/
        eshopModels = Package.models;

        //categoryService = new Package.services.Category();
    }

    function getCategoryByPermalink(permalink,callback){
        var category = App.Cache.get('categories.'+ permalink);
        if (!lo.isEmpty(category)) {
            return callback(null,category['categories.'+ permalink]);
        }

        return eshopModels.Category.findOne({permalink : permalink},function(err,category){

            App.Cache.set('categories.'+permalink,category);
            callback(err,category);
        });
    };

    product.prototype.findOne = function(args,options,callback) {
        var _this = this,
            query,
            searchBy = (typeof args == 'string') ? {_id : App.Helpers.Model.idToObjId(args)} : args;

        if (typeof args == 'string'){
            query = eshopModels.Product.findById(args);
        } else {
            query = eshopModels.Product.findOne(searchBy);
        }

        query.exec(function(err,product){
            if (product == null){
                console.log('Product not found',err);
                return callback('productNotFound');
            }

            callback(err,product);
        });
    };

    product.prototype.findById = function(id,options,callback) {

        eshopModels.Product.findById(id).exec(function(err,product){
            callback(err,product);
        });
    };

    product.prototype.find = function(options,callback) {
        var _this = this;
        var page = options.page || 1;
        var limit = options.limit || 10;
        var sort = (options.sort) ? options.sort : 'created_at';
        var way = (options.way) ? options.way : '-';
        var filters = (options.filters) ? options.filters : {};
        var simplified = (options.simplified) ? options.simplified : false;
        var asyncObj = {};
        //this is tricky, we need to get the catid via the permalink. Basically we should cache this kind of frequent
        //requests on start up or something in those lines

        if (typeof options.filters != 'undefined' && options.filters['categories.permalink']) {
            asyncObj.categories = function(permalink,cb){
                getCategoryByPermalink(permalink,function(err,category){
                    filters.categories = {
                        type : 'equals',
                        value : category.id || category['_id']
                    };

                    delete options.filters['categories.permalink'];
                    cb(null,category);
                });
            }.bind(null,options.filters['categories.permalink']);
        }


        async.series(asyncObj,function(err,results){
            var query = eshopModels.Product.find(App.Helpers.Model.setupFilters(filters));
            query
                .limit(limit)
                .skip((page - 1) * limit)
                .sort(way + sort)
                .exec(function(err,products){
                    callback(err,products);
                });
        });


    };

    product.prototype.count = function(filters,callback){
        if (filters['categories.permalink']){
            return getCategoryByPermalink(filters['categories.permalink'],function(err,category){
                filters.categories = category.id || category['_id'];
                delete filters['categories.permalink'];
                eshopModels.Product.count(filters,callback);
            });
        }

        return eshopModels.Product.count(App.Helpers.Model.setupFilters(filters),callback);
    };

    product.prototype.getProducts = function(options,callback){
        var _this = this;
        var sort = (options.sort) ? options.sort : 'created_at';
        var way = (options.way) ? options.way : '-';
        eshopModels.Product.find()
            .limit(10)
            .sort(way + sort)
            .exec(function(err,products){
                var productCount = products.length,
                    asyncArr = [];
                for (var i=0;productCount > i;i++){
                    asyncArr.push(function(product,callback){
                        var asyncObj = {};
                        //we need to eager load this. The way we aproach it now is no optimal
                        asyncObj = {
                            eshop : _this.applyDiscount.bind(null,product.eshop),
                            thumb : _this.getProductThumb.bind(null,product.thumb)
                        };

                        async.parallel(asyncObj,function(err,results){

                            product = lo.merge(product,results);
                            callback(err,product);
                        });
                    }.bind(null,products[i]));
                }

                async.parallel(asyncArr,callback);
            });
    };

    product.prototype.getProduct = function(args,options,callback){

        var _this = this;
        var searchBy = (typeof args == 'string') ? {id : args} : args;

        eshopModels.Product.findOne(searchBy)
            .exec(function(err,product){

                asyncObj = {
                    categories : _this.getProductCategories.bind(null,product.categories),
                    ExtraFields : _this.getProductExtraFields.bind(null,product.ExtraFields),
                    eshop : _this.applyDiscount.bind(null,product.eshop),
                    related : _this.getProductRelated.bind(null,product.related),
                    upselling : _this.getProductUpselling.bind(null,product.upselling),
                    thumb : _this.getProductThumb.bind(null,product.thumb)
                };

                if (typeof product.mediaFiles.images != 'undefined'){
                    asyncObj.images =  _this.getProductImages.bind(null,product.mediaFiles.images);
                }

                async.parallel(asyncObj,function(err,results){

                    product = lo.merge(product,results);
                    callback(err,product);
                });
            });
    };

    product.prototype.getProductCategory = function(options,callback){
        if (typeof options.permalink){
            return getCategoryByPermalink(options.permalink,callback);
        }

        return eshopModels.Category.findById(App.Helpers.Model.idToObjId(options.id)).exec(callback);
    };

    product.prototype.getProductCategories = function(catIds,callback){
        var ids = lo.uniq(lo.flatten(catIds));
        ids = App.Helpers.Model.arrayToObjIds(ids);
        eshopModels.Category.where('_id').in(ids).exec(callback);
    };

    product.prototype.getProductExtraFields = function(efieldIds,callback){
        var idsArr = [],
            idsObj = {},
            len = efieldIds.length;

        for (var a =0; len > a;a++){
            idsArr.push(efieldIds[a].fieldID);
            idsObj[efieldIds[a].fieldID] = efieldIds[a].value;
        }

        var ids = App.Helpers.Model.arrayToObjIds(idsArr);
        eshopModels.ExtraField.where('_id').in(ids).exec(function(err,fields){
            for (var a in fields){
                fields[a].value = idsObj[fields[a].id];
            }
            callback(null,fields);
        });
    };

    product.prototype.applyDiscount = function(product,callback){
        callback(null,product);
    };

    product.prototype.getProductRelated = function(ids,callback){
        eshopModels.Product.where('_id').in(App.Helpers.Model.arrayToObjIds(ids)).exec(callback);
    };

    product.prototype.getProductUpselling = function(ids,callback){
        eshopModels.Product.where('_id').in(App.Helpers.Model.arrayToObjIds(ids)).exec(callback);
    };

    product.prototype.getProductImages = function(ids,callback){
        return baseItemService.getImages('ProductImage',ids,null,callback);
    }

    product.prototype.getProductThumb = function(thumb,callback){

        return baseItemService.getThumb('ProductImage',thumb,null,callback);
    }

    product.prototype.update = function(action,ids,callback){
        if (action == 'delete'){
            //need a delete product service in order to remove any files as well
            eshopModels.Product.remove({ _id: { $in: ids } },callback);
            return;
        }

        ids = App.Helpers.Model.arrayToObjIds(ids);
        var active = (action == 'enable') ? true : false;
        eshopModels.Product.update({ _id: { $in: ids } }
            ,{$set : {active : active}},{multi: true},callback);
    }

    product.prototype.deleteProduct = function(id,callback){

    };

    return product;
});