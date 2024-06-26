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
  res.send(rows)
})

app.get('/modifyobject', async (req, res) => {
  const dbRes = await db.updateObject(req.query.id, req.query.nom, req.query.local, req.query.localisation)
  console.log(dbRes)
  res.redirect('back')
})

app.get('/getvideos/:id', async (req, res) => {
  const dbRes = await db.getVideos(req.params.id)
  res.send(dbRes)
})

app.post('/videoinfo', async (req, res) => {
  const dbStatus = await db.changeObjectStatus(req.body['objet'], req.body['is_display_ads'])
  console.log(req.body['videos'])
  req.body['videos'].forEach(async element => {
    const dbRes = await db.addVideoInfo(element.date_jour, element.video, req.body['objet'], element.nb, element.temps)
  });
  res.send("Info sent successfully!")
})

app.get('/objetstatus/:id', async (req, res) => {
  const dbRes = await db.getObjectStatus(req.params.id)
  res.send(dbRes)
})

app.get('/getinfo/:idobjet', async (req, res) => {
  const dbRes = await db.getVideoInfo(req.params.idobjet)
  res.send(dbRes)
})

app.post('/sendvideo', upload.single('video'), async (req, res) =>{
  console.log('incoming request')
  const dbRes = await db.addVideo(req.body['nom'], 1000, "md5iswearitstrue", req.file.filename, req.body['id'])
  res.redirect('back')
})

app.post('/deletevideo', async (req, res) => {
  console.log(req.body)
  const id = req.body['idvideo']
  const dbRes = await db.deleteVideo(id)
  res.redirect('back')
})

app.post('/updatevideo', async (req, res) => {
  const dbRes = await db.updateVideo(req.body['idvideo'], req.body['nom'], req.body['ordre'])
  res.redirect('back')
})

app.get('/download/:filename', async (req, res) => {
  const filepath = `/home/admis/6GP-Backend/videos/${req.params.filename}.mp4`
  res.sendFile(filepath)
})

app.listen(port, '0.0.0.0', () => {
  console.log(`Example app listening on port ${port}`)
})
