module.exports = (function(App,Package,Route){
    var isAuthenticated = function (req, res, next) {
        if (req.isAuthenticated()) {
            return next();
        }

        res.status(403).send('Not loged in');
    };

    var productID = Route.param('productID', function (req, res, next, id) {
        next();
    });

    var permalink = Route.param('permalink', function (req, res, next, id) {
        next();
    });

    var page = Route.param('page', function (req, res, next, id) {
        next();
    });

    Route.group({prefix:'/api/products',filters:[],middleware : isAuthenticated},[
        function(){
            return {
                method : 'post',
                route:'find',
                as : 'findProducts',
                exec : 'Product/productsCtrl.find'
            };
        },
        function(){
            return {
                method : 'post',
                route:'findOne',
                as : 'findOneProduct',
                exec : 'Product/productsCtrl.findOne'
            };
        },
        function(){
            return {
                method : 'post',
                route:'update',
                as : 'updateProducts',
                exec : 'Product/productsCtrl.update'
            };
        },
        function(){
            return {
                method : 'post',
                route:'updateOne',
                as : 'updateOneProduct',
                exec : 'Product/productsCtrl.updateOne'
            };
        }
    ]);

    App.serviceProviders.eshop.App.get('/eshop', function (req, res) {
        res.render('partials/index',{
            title: 'Eshop area',
            items: [
                'apple',
                'orange',
                'banana'
            ]
        });
    });

    return App;
});
