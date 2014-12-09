module.exports = function (mongoose, modelName) {
    var Schema = mongoose.Schema;

    var schema = mongoose.Schema({
        sku: { type: String, index: true },
        title: { type: String, index: true },
        permalink: { type: String, index: true },
        description: String,
        description_long: String,
        created_at: Date,
        updated_at: Date,
        uid: String,
        active: Boolean,
        categories : [],
        extraFields : {},
        settings: {},
        eshop: {
            price : { type: Number, index: true },
            list_price : Number
        },
        thumb :{},
        mediaFiles : {},
        related :[],
        upselling :[],
        productOptions : {},
        translations : {},
        ExtraFields : []
    },{
        id : true
    });

    schema.set('toObject', { getters: true });
    schema.set('toJSON', { getters: true });

    var autoID = require('mcms-node-core/lib/Framework/Database/drivers/mongo-auto-increment');
    schema.plugin(autoID, {
        DB : mongoose.connections[0],
        model:'products',
        options : {
            index: true,
            autoIdName : 'autoID'
        }
    });

    mongoose.model(modelName, schema);

};