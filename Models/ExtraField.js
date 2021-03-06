module.exports = function (mongoose, modelName) {
    var Schema = mongoose.Schema;

    var schema = mongoose.Schema({
        title: String,
        varName : { type: String, index: true },
        permalink: { type: String, index: true },
        module: String,
        type: String,
        created_at: Date,
        updated_at: Date,
        settings: {},
        active: Boolean,
        fieldOptions : [],
        categories : [],
        groups :[]
    });

    schema.set('toObject', { getters: true });
    schema.set('toJSON', { getters: true });

    mongoose.model(modelName, schema);

};