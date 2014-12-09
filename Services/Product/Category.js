module.exports = (function(App,Package) {
    var Auth,
        coreServices,
        eshopModels,
        async = require('async'),
        lo = require('lodash'),
        Loader = new App.EagerLoader();

    function Category(){
        this.name = 'Category';
        this.nameSpace = 'Product';

        eshopModels = Package.models;
    }

    Category.prototype.all = function(options,callback){
        var sort = (options.sort) ? options.sort : 'orderBy';
        var way = (options.way) ? options.way : '+';
        eshopModels.Category.find()
            .sort(way + sort)
            .exec(callback);
    };

    Category.prototype.getTree = function(catID,callback){
        var Cat = eshopModels.Category;
        Cat.findById(catID).exec(function(err,category){
            return category.getArrayTree(callback);
        });
    };

    Category.prototype.getCategoryByPermalink = function(permalink,callback){
        var category = App.Cache.get('categories.'+ permalink);
        if (!lo.isEmpty(category)) {
            return callback(null,category['categories.'+ permalink]);
        }

        return eshopModels.Category.findOne({permalink : permalink},function(err,category){

            App.Cache.set('categories.'+permalink,category);
            callback(err,category);
        });
    };

    return Category;
});