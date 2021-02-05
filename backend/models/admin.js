const { Schema, model } = require('mongoose');

const adminSchema = new Schema({
    name: String,
    password: String,
    projects: []
});

module.exports = model('admin', adminSchema);