const express = require('express')
const cors = require('cors');
const router = express.Router()
router.all('*',cors())
const users = require('./controllers/users.js')
const comments = require('./controllers/comments.js')
const products = require('./controllers/products.js')
const auth = require('./middleware/auth')

router.get('/users', auth, users.getUser)
router.post('/users/login', users.login)
router.post('/users/logout', auth, users.logout)
router.post('/users', users.createUser)  // signup
router.patch('/users', auth, users.updateUser)
router.delete('/users', auth, users.deleteUser)

router.get('/products/:id', auth, products.getProduct)
router.get('/products', auth, products.getProducts)
router.post('/products', auth, products.createProduct)
router.patch('/products/:id', auth, products.updateProduct)
router.delete('/products/:id', auth, products.deleteProduct)

router.get('*', function(req, res) {
  res.send({
    error: 'This route does not exist, try /users/login'
  })
})

module.exports = router

