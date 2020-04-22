const {Schema} = require('mongoose');

const User = new Schema({
  login: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  type:String,
  pass_h:String
}, {
  timestamps: true
})

module.exports = User