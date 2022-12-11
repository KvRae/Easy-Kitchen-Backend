const mongoose = require('mongoose');

const areaSchema = new mongoose.Schema({
    strArea: {
        type: String,
        required: true,
        unique: true
    },
    strAreaThumb: {
        type: String,
        required: true,
    }
}, { timestamps: true })

module.exports = mongoose.model('area', areaSchema)