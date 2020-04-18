const express = require('express');
const app = express();
const path = require('path');
const s3 = require("./aws_client")
const bodyParser = require('body-parser');


app.use(bodyParser.json());
app.get('', (req, res) => {
  res.sendFile(path.join(__dirname + '/index.html'))
})

app.get('/test', (req, res) => {
  res.send({ express: "Hello from express" })
})

app.get('/artists', (req, res) => {
  s3.listArtists((data) => { res.send(data) })
})

app.get("/artists/:artist/albums", (req, res) => {
  s3.listAlbums(req.params.artist, (data) => {
    res.send(data)
  })
})

app.get("/artists/:artist/albums/:album/songs", (req, res) => {
  let albumPath = `${req.params.artist}/${req.params.album}`
  s3.listSongs(albumPath, (data) => {
    res.send(data)
  })
})

app.get("/artists/:artist/albums/:album/songs/:song/play", (req, res) => {
  res.set('content-type', 'audio/mp3');
  res.set('accept-ranges', 'bytes');
  songPath = `${req.params.artist}/${req.params.album}/${req.params.song}`
  let downloadStream = s3.playMusic(songPath);

  downloadStream.on('data', (chunk) => {
    res.write(chunk);
  });

  downloadStream.on('error', () => {
    res.sendStatus(404);
  });

  downloadStream.on('end', () => {
    res.end();
  });
  // downloadStream.pipe(res.send());
}
);



app.listen(5000, function () {
  console.log('makin music on 5000');
});

