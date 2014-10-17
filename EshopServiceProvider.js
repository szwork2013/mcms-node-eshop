module.exports = (function(App){
    function core(){
        this.packageName = 'eshop';
        require('./routes')(App,this);
    }



    return core;
});