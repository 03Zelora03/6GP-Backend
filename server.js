const express = require('express')
const cors = require('cors')
const db = require('./database')
const multer = require('multer')

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'videos')
  },
  filename: function(req, file, cb){
    const parts = file.mimetype.split('/')
    cb(null, `${file.fieldname}-${Date.now()}.${parts[1]}`)
  }
})
const upload = multer({storage})

const app = express()
const port = 50000

app.use(cors())
app.use(express.urlencoded({extended: false})).use(express.json())

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get('/getobjects', async (req, res) => {
  const rows = await db.getAllObjects()
  console.log("Rows: ", rows)
  res.send(rows)
})

app.get('/modifyobject', async (req, res) => {
  console.log(req.query.id)
  const dbRes = await db.updateObject(req.query.id, req.query.nom, req.query.local, req.query.localisation)
  res.send(dbRes)
})

app.get('/getvideos/:id', async (req, res) => {
  const dbRes = await db.getVideos(req.params.id)
  console.log(dbRes)
  res.send(dbRes)
})

app.post('/sendvideo', upload.single('video'), async (req, res) =>{
  console.log('incoming request')
  const dbRes = await db.addVideo(req.body['nom'], 1000, "md5iswearitstrue", req.file.filename, req.body['id'])
  res.send("Vidéo uploadée avec succès! Vous pouvez retournez sur la page précédente. Video: " + req.file.filename)
})

app.post('/deletevideo', async (req, res) => {
  console.log(req.body)
  const id = req.body['idvideo']
  const dbRes = await db.deleteVideo(id)
  res.send("Vidéo supprimée avec succès! Vous pouvez retournez sur la page précédente.")
})

app.get('/hello', (req, res) => {
  res.send('hello')
})

app.listen(port, '0.0.0.0', () => {
  console.log(`Example app listening on port ${port}`)
})
