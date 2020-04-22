const {Schema} = require('mongoose');

const Refreshtoken = new Schema({
  userid: {
    type: String,
    required: true,
  },
  refreshtoken: {
    type: String,
    required: true,
  },
}, {
  timestamps: true
})

module.exports = Refreshtoken