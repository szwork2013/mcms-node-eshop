module.exports = function (mongoose, modelName) {
    var Schema = mongoose.Schema;

    var schema = mongoose.Schema({
        sku: String,
        title: String,
        permalink: String,
        description: String,
        description_long: String,
        created_at: Date,
        modified_at: Date,
        uid: Number,
        active: Boolean,
        categories : [],
        extraFields : {},
        settings: {},
        eshop: {},
        thumb :{},
        mediaFiles : {},
        related :[],
        upselling :[],
        productOptions : {},
        translations : {}
    });

    var autoID = require('mcms-node/lib/Framework/Database/drivers/mongo-auto-increment');
    schema.plugin(autoID, {
        DB : mongoose.connections[0],
        model:'products',
        options : { index: true }
    });

    mongoose.model(modelName, schema);

};