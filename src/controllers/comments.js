const Comment = require('../models/comment')
const Product = require('../models/product')
var jsdom = require('jsdom');
const { JSDOM } = jsdom;
const { window } = new JSDOM();
const { document } = (new JSDOM('')).window;
global.document = document;

var $ = jQuery = require('jquery')(window);

if(process.env.NODE_ENV==='production'){
  var apiKey = process.env.apiKey
}
else{
  const credentials = require('../config.js')
  var apiKey = credentials.apiKey
}


const getComments = function(req, res) {
  
  Comment.find({ belongsTo: req.params._id}).then(function(comments) {
    res.send(comments)
  }).catch(function(error){
    res.status(500).send(error)
  })
}

const createComment = function(req, res){
  
  var comentariosProducto
  var newAverage=0
  var respuesta=0
  Product.findById( req.params.id ).populate('comments').exec(function(error, product) {
    if (error){
          console.log(error)
          return res.status(500).send(error)
      }
      else{
        comentariosProducto=product.comments
        newAverage=0
        newAverageSentiment=0
        for (i=0; i<comentariosProducto.length-1; i++){
          newAverage+=comentariosProducto[i].rating
          newAverageSentiment+=comentariosProducto[i].sentiment
          console.log(i)
        }
        newAverage=parseFloat(req.body.rating)+newAverage
        newAverage=newAverage/(comentariosProducto.length)
        text=req.body.description
        var settings = {
            "async": true,
            "crossDomain": true,
            "url": "https://language.googleapis.com/v1beta2/documents:analyzeSentiment?key="+apiKey,
            "method": "POST",
            "headers": {
              "Content-Type": "application/json",
              "Accept": "*/*",
              "Cache-Control": "no-cache",
              "Host": "language.googleapis.com",
              "accept-encoding": "gzip, deflate",
              "content-length": "171",
              "Connection": "keep-alive",
              "cache-control": "no-cache"
            },
            "processData": false,
            "data": "{\n  \"document\": {\n \"type\": \"PLAIN_TEXT\",\n   \"content\": \""+text+"\"\n                   } ,\n  \"encodingType\": \"UTF16\"\n}"
          }
     
          $.ajax(settings).done(function (response) {
            
            respuesta=response.documentSentiment.score*response.documentSentiment.magnitude+1
            newAverageSentiment=newAverageSentiment+((respuesta/2)*10)
            newAverageSentiment=newAverageSentiment/(comentariosProducto.length)
            Product.findOneAndUpdate(req.params.id, {totalRate:newAverage,generalSentiment:newAverageSentiment} ).then(function(product) {
              if (!product) {
                return res.status(404).send()
              }
            })



            const comment = new Comment({
              description: req.body.description,
              author: req.body.author,
              rating: req.body.rating,
              createdBy: req.user._id,
              belongsTo:req.params.id,
              sentiment:((respuesta/2)*10)
            })
            comment.save().then(function() {
              return res.send(comment)
            }).catch(function(error) {
              return res.status(400).send({ error: error })
            })


          }).fail(function(error){
            return res.status(400).send({ error: error })
          })
      }
  })
}

const deleteComment = function(req, res) {
  if(req.user.typee=='userOnly'){
    return res.status(401).send({ error: 'Admins Only'})
    }
  const _id = req.params.id
  Comment.findByIdAndDelete({ _id }).then(function(comment){
    if(!comment) {
      return res.status(404).send({ error: `Task with id ${_id} not found.`})
    }
    return res.send(comment)
  }).catch(function(error) {
    res.status(505).send({ error: error })
  })
}

module.exports = {
  getComments : getComments,
  
  createComment : createComment,
  
  deleteComment : deleteComment
}