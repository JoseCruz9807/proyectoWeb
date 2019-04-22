const express = require ('express')
const path = require('path')
const app = express()
const publicDir = path.join(__dirname,'public')
const port = process.env.PORT || 3000

app.use(express.static(publicDir))


app.get('*', function(req, res){
    res.send({
        error:'Esta ruta no existe'
    })
})

app.listen(port, function(){
    console.log('up and running')
})
//npm install -g nodemon 