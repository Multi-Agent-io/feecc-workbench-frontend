const path = require('path')
const express = require('express')
const app = express()

app.use(express.static(path.join(__dirname, 'target')))

app.get('/*', function (req, res){
  res.sendFile(path.join(__dirname, 'target', 'index.html'))
})

app.listen(9000)
