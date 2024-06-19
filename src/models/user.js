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
  money: {
    type: Number,
    required: false,
    default: 0,
    integer: true,
    min: 0,
    max: 1000000,
  },
  age: {
    type: String,
    required: true,
    min: 18,
    max: 100,
  },
  createdAt: {
    type: String,
    required: true,
    default: Date().toLocaleString('es-ES'),
  },
})

module.exports = mongoose.model('User', userSchema)
