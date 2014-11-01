module.exports = (function(App,Package){


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
