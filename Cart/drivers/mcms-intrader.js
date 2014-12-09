var inTrader = require('intrader');
var Cart = new inTrader();


module.exports =  {
    obj : Cart,
    add : function(item){
        Cart.addItem(item);
        return Cart.items();
    },
    remove : function(item){

    },
    update : function(item){

    },
    items : function(){
        return Cart.items();
    },
    addCurrency : function(currency){

    },
    removeCurrency : function(currency){

    },
    updateCurrency : function(currency){

    },
    clear : function(){

    },
    vatTotal : function(){

    },
    itemTotal : function () {

    },
    subTotal : function(){
        return Cart.subTotal();
    },
    toJSON : function(){
        return Cart.toJSON();
    },
    customer : function(data){

    },
    payment : function(method){

    }
};