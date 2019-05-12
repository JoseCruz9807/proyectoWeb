const mongoose = require('mongoose')
const validator = require('validator')
if(process.env.NODE_ENV==='production'){
  var sec = process.env.secret
}
else{
  const credentials = require('../config.js')
  var sec = credentials.secret
}

const commentSchema = new mongoose.Schema({
  description: {
    type: String,
    required: true
  },
  author: {
    type: String,
    required: true
  },
  rating:{
    type: Number,
    required: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  belongsTo: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Product'
  }
})

const Comment = mongoose.model('Comment', commentSchema)

module.exports = Comment
