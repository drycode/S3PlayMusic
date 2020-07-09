const express = require('express');
const app = express();
const path = require('path');
const { nullAlbum } = require("./clients/null_responses.js")

const { s3Client } = require("./clients/aws_client.js")
const bodyParser = require('body-parser');
const discogs = require('./clients/discogs_client');
const cacheMiddleware = require("./helpers/cache.js")

const logger = require("./lib/logger.js")
const expressPino = require('express-pino-logger');
const expressLogger = expressPino({ logger });

const defaultCacheTTL = 100


app.use(bodyParser.json(), expressLogger)
app.get('', (req, res) => {
  res.sendFile(path.join(__dirname + '/index.html'))
})

app.get('/test', (req, res) => {
  res.send({ express: "Hello from express" })
})

app.get('/artists', cacheMiddleware(defaultCacheTTL), async (req, res) => {
  let response = {}
  let limit = parseInt(req.query.limit)
  let page = parseInt(req.query.page)
  let data = await s3Client.listArtists()

  // const promises = data.map(async (artist) => {
  const promises = data.slice(limit * page, limit * page + limit).map(async (artist) => {
    return [artist, await s3Client.getArtistCache(artist)]
  })
  responses = await Promise.all(promises)
  responses.map(data => {
    // TODO: Clean up
    delete data[1].master_id
    delete data[1].master_url
    delete data[1].uri
    response[data[0]] = data[1]
  })

  res.send(response)
})


app.get("/artists/:artist/albums", cacheMiddleware(defaultCacheTTL), async (req, res) => {
  const artistName = req.params.artist
  let response = {};

  let albums = await s3Client.listAlbums(artistName)
  const promises = albums.map(async (album) => {
    let result = await discogs.getAlbumId(artistName, album)
    try {
      let masterId = result.data.results[0].id
      let tempRes = await discogs.getAlbumDetails(masterId)
      return [album, tempRes.data]
    } catch (error) {
      logger.error(error)
      return [album, nullAlbum]
    }
  })

  responses = await Promise.all(promises)
  responses.map(data => { response[data[0]] = data[1] })
  logger.debug(response)
  res.send(response)
})



app.get("/artists/:artist/albums/:album/songs", cacheMiddleware(defaultCacheTTL), (req, res) => {
  let albumPath = `${req.params.artist}/${req.params.album}`
  s3Client.listSongs(albumPath, (err, data) => {
    if (err) {
      res.send(err)
    }
    else { res.send(data) }
  })
})


app.get("/artists/:artist/albums/:album/songs/:song/play", (req, res) => {
  songPath = `${req.params.artist}/${req.params.album}/${req.params.song}`
  let downloadStream = s3Client.playMusic(songPath);
  console.log("Request initiated")
  res.set('content-type', 'audio/mp3');
  res.set('accept-ranges', 'bytes');

  downloadStream.on('error', (err) => {
    if (err.code === "NoSuchKey") {
      let code = err.code
      let message = err.message
      console.log({ code, message, key: songPath })
      setTimeout(() => {
        downloadStream.emit('end');
      }, 20);
    }
  });

  downloadStream.on('data', (chunk) => {
    res.write(chunk);
  });

  downloadStream.on('end', () => {
    console.log("Download Complete.")
    res.end();
  });



});



app.listen(5000, function () {
  console.log('makin music on 5000');
});

