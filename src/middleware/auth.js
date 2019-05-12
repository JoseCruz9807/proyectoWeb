const jwt = require('jsonwebtoken')

const User = require('../models/user')

if(process.env.NODE_ENV==='production'){
  var sec = process.env.secret
}
else{
  const credentials = require('../config.js')
  var sec = credentials.secret
}


const auth = function( req, res, next ) {
  try {
    const token = req.header('Authorization').replace('Bearer ', '')
    const decoded = jwt.verify(token, sec)
    User.findOne({ _id: decoded._id, 'tokens.token': token }).then(function(user) {
      if(!user) {
        throw new Error()
      }
      req.token = token
      req.user = user
      next()
    }).catch(function(error) {
      res.status(401).send({ error: 'Authenticate plz'})
    })
  } catch(e) {
    res.status(401).send({ error: 'Authenticate plz'})
  }
}

const auth2 = function( req, res, next ) {
  try {
    const token = req.header('Authorization').replace('Bearer ', '')
    const decoded = jwt.verify(token, sec)
    User.findOne({ _id: decoded._id, 'tokens.token': token }).then(function(user) {
      if(!user) {
        throw new Error()
      }
      req.token = token
      req.user = user
      next()
    }).catch(function(error) {
      res.status(401).send({ error: 'Authenticate plz'})
    })
  } catch(e) {
    res.status(401).send({ error: 'Authenticate plz'})
  }
  try {
    const token = req.header('ProductToken').replace('Bearer ', '')
    const decoded = jwt.verify(token, sec)
    Product.findOne({ _id: decoded._id, 'tokens.token': token }).then(function(product) {
      if(!product) {
        throw new Error()
      }
      req.token = token
      req.product = product
      next()
    }).catch(function(error) {
      res.status(401).send({ error: 'Authenticate plz'})
    })
  } catch(e) {
    res.status(401).send({ error: 'Authenticate plz'})
  }
}
module.exports = {auth:auth,
auth2:auth2}