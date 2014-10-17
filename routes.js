module.exports = (function(App,Package){

    App.server.set('views', __dirname + '/views');
    App.registerViews(__dirname + '/views');

    App.server.get('/eshop', function (req, res) {
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
