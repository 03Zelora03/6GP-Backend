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
app.use(express.urlencoded({extended: true})).use(express.json())

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

app.get('/videoinfo/:date/:video/:objet/:nb/:temps', async (req, res) => {
  console.log(req.params.date)
  console.log(req.params.video)
  console.log(req.params.objet)
  console.log(req.params.nb)
  console.log(req.params.temps)
  const dbRes = await db.addVideoInfo(req.params.date, req.params.video, req.params.objet, req.params.nb, req.params.temps)
  res.send("ÇA SENT LE CACA")
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

app.post('/updatevideo', async (req, res) => {
  const dbRes = await db.updateVideo(req.body['idvideo'], req.body['nom'], req.body['ordre'])
  res.redirect('back')
})

app.get('/download/:filename', async (req, res) => {
  const filepath = `/home/admis/6GP-Backend/videos/${req.params.filename}.mp4`
  res.sendFile(filepath)
})

app.get('/hello', (req, res) => {
  res.send('hello')
})

app.listen(port, '0.0.0.0', () => {
  console.log(`Example app listening on port ${port}`)
})
