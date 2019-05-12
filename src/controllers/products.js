const Product = require('../models/product')

// ya no debería tener esta ruta a menos que sea un usuario tipo admin
const getProducts = function(req, res) {
  Product.find({}).then(function(products) {
    res.send(products)
  }).catch(function(error){
    res.status(500).send(error)
  })
}

const getProduct = function(req, res) {
  // cualquier usuario no deberia ser capaz de ver la info de un usuario
  // a menos que sea un admin. Aqui yo ya no admitire que me pasen el :id 
  // solo usare el id de la request-> req.user._id
  // como ya tenemos toda la info del usuario gracias a auth
  // ya no necesitamos hacer un User.findOne de nuevo!,
  // todo esta en req.user
  // solo nos faltaria agregar los todos del Schema Todo
  // req.user.populate()
  // req.user
  // User.findById(_id).then(function(user) {
  //   if(!user){
  //     return res.status(404).send()
  //   }
  Product.findById( req.product._id ).populate('comments').exec(function(error, product) {
  // req.user.populate('todos').exec(function(error, user) {  
    // user ya tiene la info de req.user y req.user.todos
    return res.send(product)
  })
  // }).catch(function(error) {
  //   return res.status(500).send(error)
}

const createProduct = function(req, res){
    if(req.user.typee=='userOnly'){
        return res.status(401).send({ error: 'Authenticate plox'})
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
    image:req.body.image
  })
  product.save().then(function() {
    return res.send(product)
  }).catch(function(error) {
    return res.status(400).send(error)
  })
}

const goIn = function(req, res) {
  Product.findByCredentials(req.body.name).then(function(product){
    product.generateToken().then(function(token){
      return res.send({product, token})
    }).catch(function(error){
      return res.status(401).send({ error: error })
    })
  }).catch(function(error) {
    return res.status(401).send({ error: error })
  })
}


const updateProduct = function(req, res) {
  // solo admitire hacer update de mi usuario que hizo login
  // quitare la ruta de PATCH users/:id y la cambiare solo por PATCH /users
  // const _id = req.params.id
  const _id = req.product._id
  const updates = Object.keys(req.body)
  const allowedUpdates = ['image', 'typee', 'ingredients','skin_type','anti_aging','hypoallergenic','paraben_free','perfume','price','content']
  // revisa que los updates enviados sean permitidos, que no envie una key que no permitimos
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

// este solo lo utilizarían si quisieran eliminar una cuenta, cancelar subscripcion, etc
// y de igual forma, solo podrían deberían borrar el usuario en el que hicieron login
// por lo tanto, no se le pasa un id, usan el de el token
const deleteProduct = function(req, res) {
  // const _id = req.params.id
  const _id = req.product._id
  Product.findByIdAndDelete(_id).then(function(product){
    if(!product) {
      return res.status(404).send()
    }
    return res.send(user)
  }).catch(function(error) {
    res.status(505).send(error)
  })
}

module.exports = {
  getProducts : getProducts,
  getProduct: getProduct,
  goIn: goIn,
  //logout: logout,
  createProduct : createProduct,
  updateProduct : updateProduct,
  deleteProduct : deleteProduct
}