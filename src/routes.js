const express = require('express')
const cors = require('cors');
const router = express.Router()
router.all('*',cors())
const users = require('./controllers/users.js')
const comments = require('./controllers/comments.js')
const products = require('./controllers/products.js')
const auth = require('./middleware/auth.js')

router.get('/users', auth.auth, users.getUser)
router.post('/users/login', users.login)
router.post('/users/logout', auth.auth, users.logout)
router.post('/users', users.createUser)  // signup
router.patch('/users', auth.auth, users.updateUser)
//router.delete('/users', auth.auth, users.deleteUser)

router.get('/products/:id', auth.auth, products.getProduct)
router.get('/products', auth.auth, products.getProducts)
router.post('/products', auth.auth, products.createProduct)
router.patch('/products/:id', auth.auth, products.updateProduct)
router.delete('/products/:id', auth.auth, products.deleteProduct)

router.post('/comments/:id', auth.auth, comments.createComment)
router.delete('/comments/:id', auth.auth, comments.deleteComment)

router.get('*', function(req, res) {
  res.send({
    error: 'This route does not exist, try /users/login'
  })
})

module.exports = router

