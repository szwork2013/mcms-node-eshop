module.exports = (function(App){
    var express = require('express');
    var miniApp = express();
    var mcmsCartObj = require('mcms-node-cart');
    function core(){
        miniApp.set('views', __dirname + '/views');
        miniApp.use(App.express.static(__dirname + '/public'));

        this.App = miniApp;
        this.models = App.Database[App.Config.database.default].loadModels(App.Database[App.Config.database.default].mongoose,
            __dirname + '/Models');
        this.services = App.loadServices(__dirname + '/Services',null,this);
        var Cart = mcmsCartObj.Cart(App.server);
        this.Conditions = mcmsCartObj.Conditions;
        this.Cart = new Cart('cart');
        this.adminModule = __dirname + '/admin-package.json';
        miniApp.use(this.Cart.init());
        var _this = this;
        App.Lang.add({
            directory : __dirname + '/Lang'
        });
        miniApp.use(function(req, res, next){


            res.locals.Cart = _this.Cart.fullCart();
            next();
        });

        this.packageName = 'eshop';
        this.viewDirs =  __dirname + '/views';
        this.modelRelationships = {
            categories : {
                as : 'categories',
                join : 'getProductCategories',
                onSource : 'id',
                onDest : 'id',
                inject : 'categories'
            },
            ExtraFields : {
                as : 'ExtraFields',
                join : 'getProductExtraFields',
                onSource : 'id',
                onDest : 'id',
                inject : 'ExtraFields'
            },
            eshop : {
                as : 'eshop',
                join : 'applyDiscount',
                onSource : 'id',
                onDest : 'id',
                inject : 'eshop'
            },
            related : {
                as : 'related',
                join : 'getProductRelated',
                onSource : 'id',
                onDest : 'id',
                inject : 'related'
            },
            upselling : {
                as : 'upselling',
                join : 'getProductUpselling',
                onSource : 'id',
                onDest : 'id',
                inject : 'upselling'
            },
            thumb : {
                as : 'thumb',
                join : 'getProductThumb',
                onSource : 'id',
                onDest : 'id',
                inject : 'thumb',
                return : 'single'
            },
            images : {
                as : 'images',
                join : 'getProductImages',
                onSource : 'id',
                onDest : 'id',
                inject : 'mediaFiles.images'
            }
        };
    }



    return core;
});