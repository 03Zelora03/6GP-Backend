const express = require('express')
const cors = require('cors')
const db = require('./database')

const app = express()
const port = 50000

app.use(cors())

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get('/getobjects', async (req, res) => {
  const rows = await db.getAllObjects()
  console.log("Rows: ", rows)
  res.send(rows)
})

app.get('/hello', (req, res) => {
  res.send('hello')
})

app.listen(port, '0.0.0.0', () => {
  console.log(`Example app listening on port ${port}`)
})
