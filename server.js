const express = require('express')
const db = require('./database')

const app = express()
const port = 50000

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get('/test', (req, res) => {
  const rows = db.testDatabase()
  console.log("Rows: ", rows)
  res.send(rows)
})

app.get('/hello', (req, res) => {
  res.send('hello')
})

app.listen(port, '0.0.0.0', () => {
  console.log(`Example app listening on port ${port}`)
})
