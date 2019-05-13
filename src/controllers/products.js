const Product = require('../models/product')

const getProducts = function(req, res) {
  Product.find({}).then(function(products) {
    res.send(products)
  }).catch(function(error){
    res.status(500).send(error)
  })
}

const getProduct = function(req, res) {
  
  Product.findById( req.params.id ).populate('comments').exec(function(error, product) {
    if (error){
        console.log(error)
        return res.status(500).send(error)
    }
    else{return res.send(product) }
  })
}

const createProduct = function(req, res){
    if(req.user.typee=='userOnly'){
        return res.status(401).send({ error: 'Admins Only'})
    }
  const product = new Product({
    name: req.body.name,
    brand: req.body.brand,
    typee:req.body.typee,
    skin_type:req.body.skin_type,
    ingredients:req.body.ingredients,
    anti_aging:req.body.anti_aging,
    hypoallergenic:req.body.hypoallergenic,
    paraben_free:req.body.paraben_free,
    perfume:req.body.perfume,
    content:req.body.content,
    price:req.body.price,
    image:req.body.image,
    totalRate:0
  })
  product.save().then(function() {
    return res.status(200).send(product)
  }).catch(function(error) {
    return res.status(450).send(error)
  })
}

const updateProduct = function(req, res) {

  if(req.user.typee=='userOnly'){
    return res.status(401).send({ error: 'Admins Only'})
    }
  const _id = req.params._id
  const updates = Object.keys(req.body)
  const allowedUpdates = ['image', 'typee', 'ingredients','skin_type','anti_aging','hypoallergenic','paraben_free','perfume','price','content']
  const isValidUpdate = updates.every((update) => allowedUpdates.includes(update))

  if( !isValidUpdate ) {
    return res.status(400).send({
      error: 'Invalid update, only allowed to update: ' + allowedUpdates
    })
  }
  Product.findByIdAndUpdate(_id, req.body ).then(function(product) {
    if (!product) {
      return res.status(404).send()
    }
    return res.send(product)
  }).catch(function(error) {
    res.status(500).send(error)
  })
}


const deleteProduct = function(req, res) {

  if(req.user.typee=='userOnly'){
    return res.status(401).send({ error: 'Admins Only'})
    }
  const _id = req.params.id
  Product.findByIdAndDelete(_id).then(function(product){
    if(!product) {
      return res.status(404).send()
    }
    return res.send(product)
  }).catch(function(error) {
    res.status(505).send(error)
  })
}

module.exports = {
  getProducts : getProducts,
  getProduct: getProduct,
  createProduct : createProduct,
  updateProduct : updateProduct,
  deleteProduct : deleteProduct
}