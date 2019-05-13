const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
if(process.env.NODE_ENV==='production'){
  var sec = process.env.secret
}
else{
  const credentials = require('../config.js')
  var sec = credentials.secret
}


const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  brand: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true
  },
  typee: {
    type: String,
    required: true
  },
  ingredients:
    [{
          type: String,
          required: true
    }],
  skin_type: [{
      type: String,
      required: true
    }],
    anti_aging:{
        type: Boolean,
        required: true
    },
    hypoallergenic:{
        type: Boolean,
        required: true
    },
    paraben_free:{
        type: Boolean,
        required: true
    },
    perfume:{
        type: Boolean,
        required: true
    },
    content:{
        type: Number,
        required: true
    },
    price:{
        type: Number,
        required: true
    },
    totalRate:{
      type:Number,
      required: true,
      default: 0
    },
    generalSentiment:{
      type: Number,
      required: true,
      default: 0
    }
},{
  toObject: {
    virtuals: true
  },
  toJSON: {
    virtuals: true 
  }
})


productSchema.virtual('comments', {
  ref: 'Comment',
  localField: '_id',
  foreignField: 'belongsTo'
})


productSchema.statics.findByCredentials = function(productName) {
  return new Promise( function(resolve, reject) {
    Product.findOne({ productName }).then(function(product) {
        return resolve(product)
      }).catch( function(error) {
        return reject('No product found')
      })
  })
}

productSchema.pre('save', function(next) {
  const product = this
    next()  
})

const Product = mongoose.model('Product', productSchema)

module.exports = Product

