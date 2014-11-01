module.exports = function (mongoose, modelName) {
    var Schema = mongoose.Schema;

    var schema = mongoose.Schema({
        title: String,
        permalink: String,
        module: String,
        type: String,
        created_at: Date,
        modified_at: Date,
        settings: {},
        active: Boolean,
        categories : [],
        groups :[]
    });



    mongoose.model(modelName, schema);

};