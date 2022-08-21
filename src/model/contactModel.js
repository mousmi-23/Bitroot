const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
    userName : {
        type : String,
        required : true,
        trim : true
    },
    userContact : {
        type : String,
        required: true,
        unique: true,
        trim : true,
        minLen : 10
    },
    contactPhoto : {
        type : String,
        trim : true
    },
    isDeleted : {
        type : Boolean,
        default: false
    }

}, {timestamps : true})

module.exports = mongoose.model("contact", contactSchema)