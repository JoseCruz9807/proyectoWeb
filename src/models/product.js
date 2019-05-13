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

// una relacion entre dos Schemas, no lo guarda, es virtual 
productSchema.virtual('comments', {
  ref: 'Comment',
  localField: '_id',
  foreignField: 'belongsTo'
})
/*
productSchema.methods.toJSON = function() {
  const product = this
  const productObject = product.toObject()

  //delete product.password
  //delete productObject.tokens

  return productObject
}*/


productSchema.statics.findByCredentials = function(productName) {
  return new Promise( function(resolve, reject) {
    Product.findOne({ productName }).then(function(product) {
        return resolve(product)
      }).catch( function(error) {
        return reject('No product found')
      })
  })
}
/*
productSchema.methods.generateToken = function() {
  const user = this
  const token = jwt.sign({ _id: user._id.toString() }, sec, { expiresIn: '7 days'})
  user.tokens = user.tokens.concat({ token })
  return new Promise(function( resolve, reject) {
    user.save().then(function(user){
      return resolve(token)
    }).catch(function(error) {
      return reject(error)
    })
  })
}
*/
productSchema.pre('save', function(next) {
  const product = this
    next()  
})

const Product = mongoose.model('Product', productSchema)

module.exports = Product

