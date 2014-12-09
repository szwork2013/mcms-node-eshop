module.exports = (function(App,Engine){
    var fs = require('fs');
    var driver = Engine || 'mcms';


    //Load the driver, first check if we have a native
    if (!fs.existsSync(__dirname + '/drivers/' +  driver + '.js')){
        //no native driver found, try a require
        return require(driver);
    }

    return require('./drivers/' + driver);
});