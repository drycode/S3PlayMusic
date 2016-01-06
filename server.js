const express = require('express');
const app = express();
const s3 = require("./aws_client")
const bodyParser = require('body-parser');


app.use(bodyParser.json());

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

// res.render(s3.listArtists((data) => console.log(data)))
//   var params = {
//     Bucket: config.bucket,
//     Key: 'test.mp3'
//   };

//   var downloadStream = client.downloadStream(params);

//   downloadStream.on('error', function () {
//     res.status(404).send('Not Found')f;
//   });
//   downloadStream.on('httpHeaders', function (statusCode, headers, resp) {
//     // Set Headers
//     res.set({
//       'Content-Type': headers['content-type']
//     });
//   });

//   // Pipe download stream to response
//   downloadStream.pipe(res);



app.listen(3000, function () {
  console.log('makin music on 3000');
});

