module.exports = function (mongoose, modelName) {
    var materializedPlugin = require('mongoose-materialized');
    // Define your mongoose model as usual...
    var schema = mongoose.Schema({
        category: { type: [String], index: true },
        description: String,
        permalink: String,
        orderby: Number,
        created_at: Date,
        updated_at: Date,
        settings : {}
    });
    schema.plugin(materializedPlugin);

    mongoose.model(modelName, schema);
};