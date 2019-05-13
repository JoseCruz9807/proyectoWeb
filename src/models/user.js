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


const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  age: {
    type: Number,
    required: true,
    validate(value) {
      if ( value < 13 ) {
        throw new Error('Debes ser mayor de 13 años')
      }
    }
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate(value) {
      if(!validator.isEmail(value)) {
        throw new Error('Email invalido')
      }
    }
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    trim: true
  },
  tokens: [{
    token: {
      type: String,
      required: true
    }
  }],
  typee:{
    type:String,
    required: true,
    default:"userOnly",
    validate(value) {
      if ( !validator.equals(value,"userOnly")&& !validator.equals(value,"admin")) {
        throw new Error('Rol inválido')
      }
    }
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

userSchema.virtual('comments', {
  ref: 'Comment',
  localField: '_id',
  foreignField: 'createdBy'
})

userSchema.methods.toJSON = function() {
  const user = this
  const userObject = user.toObject()

  delete userObject.password
  delete userObject.tokens

  return userObject
}


userSchema.statics.findByCredentials = function(email, password) {
  return new Promise( function(resolve, reject) {
    User.findOne({ email }).then(function(user) {
      if( !user ) {
        return reject('User does not exist')
      }
      bcrypt.compare(password, user.password).then(function(match) {
        if(match) {
          return resolve(user)
        } else {
          return reject('Wrong password!')
        }
      }).catch( function(error) {
        return reject('Wrong password!')
      })
    })
  })
}

userSchema.methods.generateToken = function() {
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

userSchema.pre('save', function(next) {
  const user = this
  if( user.isModified('password') ) {
    bcrypt.hash(user.password, 8).then(function(hash){
      user.password = hash
      next()
    }).catch(function(error){
      return next(error)
    })
  } else {
    bcrypt.hash(user.password, 8).then(function(hash){
      user.password = user.password
      next()
    }).catch(function(error){
      return next(error)
    })
  }
})

const User = mongoose.model('User', userSchema)

module.exports = User

