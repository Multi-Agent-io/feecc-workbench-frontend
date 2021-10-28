const path = require('path')
const express = require('express')
const app = express()
const port = process.env.NODE_PORT || 3000;

app.use(express.static(path.join(__dirname, 'target')))

app.get('/*', function (req, res){
  res.sendFile(path.join(__dirname, 'target', 'index.html'))
})

console.log(`Server started on port: ${port}`)

app.listen(port)

var process = require('process')

process.on('SIGINT', () => {
  console.info("Shutting down NodeJS server")
  process.exit(0)
})