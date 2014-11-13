module.exports = (function(App){
    var express = require('express');
    var miniApp = express();

    function core(){
        miniApp.set('views', __dirname + '/views');
        miniApp.use(App.express.static(__dirname + '/public'));

        this.App = miniApp;
        this.models = App.Database[App.Config.database.default].loadModels(App.Database[App.Config.database.default].mongoose,
            __dirname + '/Models');
        this.services = App.loadServices(__dirname + '/Services',null,this);
        this.packageName = 'eshop';
        this.viewDirs =  __dirname + '/views';
    }



    return core;
});