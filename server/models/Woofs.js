const mongoose = require('mongoose')

const WoofSchema = mongoose.Schema({
    name: {
        type: String,
        require: true
    },
    content: {
        type: String,
        require: true
    },
    created: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('Woofs', WoofSchema)