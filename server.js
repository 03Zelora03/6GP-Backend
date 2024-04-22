const express = require('express')
const app = express()
const port = 50000

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get('/hello', (req, res) => {
  res.send('You are a stinky butt')
})

app.listen(port, '0.0.0.0', () => {
  console.log(`Example app listening on port ${port}`)
})
