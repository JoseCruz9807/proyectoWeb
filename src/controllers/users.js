const User = require('../models/user')
const bcrypt = require('bcryptjs')

const getUsers = function(req, res) {
  User.find({}).then(function(users) {
    res.send(users)
  }).catch(function(error){
    res.status(500).send(error)
  })
}

const getUser = function(req, res) {
  User.findById( req.user._id ).populate('comments').exec(function(error, user) {
    return res.send(user)
  })
}

const createUser = function(req, res){
  const user = new User({
    name: req.body.name,
    email: req.body.email,
    age: req.body.age,
    password: req.body.password,
    typee:"userOnly"
  })
  user.save().then(function() {
    return res.send(user)
  }).catch(function(error) {
    return res.status(400).send(error)
  })
}

const login = function(req, res) {
  User.findByCredentials(req.body.email, req.body.password).then(function(user){
    user.generateToken().then(function(token){
      return res.send({user, token})
    }).catch(function(error){
      return res.status(401).send({ error: error })
    })
  }).catch(function(error) {
    return res.status(401).send({ error: error })
  })
}

const logout = function(req, res) {
  req.user.tokens = req.user.tokens.filter(function(token) {
    return token.token !== req.token
  })
  req.user.save().then(function() {
    return res.send()
  }).catch(function(error) {
    return res.status(500).send({ error: error } )
  })
}


const updateUser = function(req, res) {
  const _id = req.user._id
  const updates = Object.keys(req.body)
  const allowedUpdates = ['name', 'age', 'password', 'email']
  const passKey=['password']
  const isValidUpdate = updates.every((update) => allowedUpdates.includes(update))
  const hasPassword=updates.every((update) => passKey.includes(update))
  if(!hasPassword){
    bcrypt.hash(req.body.password, 8).then(function(hash){
      req.body.password = hash
      if( !isValidUpdate ) {
        return res.status(400).send({
          error: 'Invalid update, only allowed to update: ' + allowedUpdates
        })
      }
      User.findByIdAndUpdate(_id, req.body ).then(function(user) {
        if (!user) {
          return res.status(404).send()
        }
        return res.send(user)
      }).catch(function(error) {
        res.status(500).send(error)
      })

    }).catch(function(error){
      return res.status(500).send(error)
    })
  }
  else{
    if( !isValidUpdate ) {
      return res.status(400).send({
        error: 'Invalid update, only allowed to update: ' + allowedUpdates
      })
    }
    User.findByIdAndUpdate(_id, req.body ).then(function(user) {
      if (!user) {
        return res.status(404).send()
      }
      return res.send(user)
    }).catch(function(error) {
      res.status(500).send(error)
    })
  }
}

const deleteUser = function(req, res) {
  const _id = req.user._id
  User.findByIdAndDelete(_id).then(function(user){
    if(!user) {
      return res.status(404).send()
    }
    return res.send(user)
  }).catch(function(error) {
    res.status(505).send(error)
  })
}

module.exports = {
  getUsers : getUsers,
  getUser: getUser,
  login: login,
  logout: logout,
  createUser : createUser,
  updateUser : updateUser,
  deleteUser : deleteUser
}