const express = require('express');
const app = express();
const path = require('path');
const { nullAlbum } = require("./models/null_responses.js")

const { s3Client } = require("./clients/aws_client.js")
const bodyParser = require('body-parser');
const discogs = require('./clients/discogs_client');
const cacheMiddleware = require("./middlewares/cache.js")

const logger = require("./lib/logger.js")
const expressPino = require('express-pino-logger');
const expressLogger = expressPino({ logger });
const Artist = require("./models/artist.js");
const Album = require('./models/album.js');
const Song = require('./models/song.js');

const defaultCacheTTL = 100

app.use(bodyParser.json(), expressLogger)
app.get('', (req, res) => {
  res.sendFile(path.join(__dirname + '/index.html'))
})

app.get('/test', (req, res) => {
  res.send({ express: "Hello from express" })
})

app.get('/artists', cacheMiddleware(defaultCacheTTL), async (req, res) => {
  if (req.query.limit & req.query.page) {
    response = await Artist.getAll(parseInt(req.query.limit), parseInt(req.query.page))
  } else {
    response = await Artist.getAll()
  }
  res.send(response)
})


app.get("/artists/:artist/albums", cacheMiddleware(defaultCacheTTL), async (req, res) => {
  response = await Album.getAlbumsByArtist(req.params.artist)
  res.send(response)
})



app.get("/artists/:artist/albums/:album/songs", cacheMiddleware(defaultCacheTTL), async (req, res) => {
  let albumPath = `${req.params.artist}/${req.params.album}`
  response = await Song.getSongsByAlbum(albumPath)
  res.send(response)
})


app.get("/artists/:artist/albums/:album/songs/:song/play", (req, res) => {
  Song.downloadAudioFile(req.params.artist, req.params.album, req.params.song, res)
});

app.listen(5000, function () {
  console.log('makin music on 5000');
});

