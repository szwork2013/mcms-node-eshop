module.exports = function (mongoose, modelName) {
    var materializedPlugin = require('mongoose-materialized');
    // Define your mongoose model as usual...
    var schema = mongoose.Schema({
        category: { type: String, index: true },
        description: String,
        permalink: { type: String, index: true },
        parentID: String,
        orderBy: Number,
        created_at: Date,
        updated_at: Date,
        settings : {}
    });
    schema.plugin(materializedPlugin);
    schema.set('toObject', { getters: true });
    schema.set('toJSON', { getters: true });
    // `modelName` in here will be "User"
    mongoose.model(modelName, schema);
};