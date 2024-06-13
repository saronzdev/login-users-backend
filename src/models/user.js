const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    user: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    age: {
        type: String,
        required: true,
        min: 18,
        max: 100,
    },
})

module.exports = mongoose.model('User', userSchema)
