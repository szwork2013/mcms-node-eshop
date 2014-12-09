module.exports = function (mongoose, modelName) {
    var Schema = mongoose.Schema;

    var schema = mongoose.Schema({
        originalFile: String,
        created_at: Date,
        updated_at: Date,
        settings: {},
        copies : {},
        details : {
            imageX : Number,
            imageY : Number
        }
    });
    schema.set('toObject', { getters: true });
    schema.set('toJSON', { getters: true });
    /*
    * Format of copies
    * {
    *   main : {
    *       imagePath : '',
    *       imageUrl : '',
    *       imageX : '',
    *       imageY : ''
    *   }
    * }
    */


    mongoose.model(modelName, schema);

};