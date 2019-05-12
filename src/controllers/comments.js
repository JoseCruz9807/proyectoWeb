const Comment = require('../models/comment')
const getComments = function(req, res) {
  // solo podemos hacer GET de los todos del usuario que hizo login
  Comment.find({ belongsTo: req.params._id}).then(function(comments) {
    res.send(comments)
  }).catch(function(error){
    res.status(500).send(error)
  })
}
/*
const getTodo = function(req, res) {
  // solo podemos traer el todo si es que es del usuario que hizo login
  const _id = req.params.id
  Todo.findOne({ _id, createdBy: req.user._id }).then(function(todo) {
    if(!todo){
      return res.status(404).send({ error: `Task with id ${_id} not found.`})
    }
    return res.send(todo)
  }).catch(function(error) {
    return res.status(500).send({ error: error })
  })
}
*/
const createComment = function(req, res){
  // los ... son para copiar todo el req.body
  const comment = new Comment({
    description: req.body.description,
    author: req.body.author,
    rating: req.body.rating,
    createdBy: req.user._id,
    belongsTo:req.params.id
  })
  comment.save().then(function() {
    return res.send(comment)
  }).catch(function(error) {
    return res.status(400).send({ error: error })
  })
}
/*
const updateComment = function(req, res) {
  const _id = req.params.id
  const updates = Object.keys(req.body)
  const allowedUpdates = ['description', 'completed']
  // revisa que los updates enviados sean permitidos, que no envie una key que no permitimos
  const isValidUpdate = updates.every((update) => allowedUpdates.includes(update))

  if( !isValidUpdate ) {
    return res.status(400).send({
      error: 'Invalid update, only allowed to update: ' + allowedUpdates
    })
  }

  // ya no solo buscamos por id, si no también deberia de ser de el owner
  // del todo por lo tanto usamos findOneAndUpdate para pasarle mas datos
  // Todo.findByIdAndUpdate(_id, req.body ).then(function(todo) {
  Comment.findOneAndUpdate({ _id, createdBy: req.user._id, belongsTo: req.product._id }, req.body ).then(function(comment) {
    if (!comment) {
      return res.status(404).send({ error: `Task with id ${_id} not found.`})
    }
    return res.send(comment)
  }).catch(function(error) {
    res.status(500).send({ error: error })
  })
}

const deleteTodo = function(req, res) {
  const _id = req.params.id
  Todo.findOneAndDelete({ _id, createdBy: req.user._id }).then(function(todo){
    if(!todo) {
      return res.status(404).send({ error: `Task with id ${_id} not found.`})
    }
    return res.send(todo)
  }).catch(function(error) {
    res.status(505).send({ error: error })
  })
}
*/
module.exports = {
  getComments : getComments,
  //getTodo: getTodo,
  createComment : createComment,
  //updateTodo : updateTodo,
  //deleteTodo : deleteTodo
}