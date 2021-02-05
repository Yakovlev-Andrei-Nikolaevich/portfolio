const { Schema, model } = require('mongoose');

const projectSchema = new Schema({
    title: String,
    titleImages: String,
    imgUrl: String
});

module.exports = model('project', projectSchema);