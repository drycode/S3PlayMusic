const express = require('express');
const app = express();
const path = require('path');

const s3 = require("./clients/aws_client")
const bodyParser = require('body-parser');
const discogs = require('./clients/discogs_client');



app.use(bodyParser.json());
app.get('', (req, res) => {
  res.sendFile(path.join(__dirname + '/index.html'))
})

app.get('/test', (req, res) => {
  res.send({ express: "Hello from express" })
})

app.get('/artists', (req, res) => {
  s3.listArtists((err, data) => {
    if (err) {
      res.send(err)
    }
    else { res.send(data) }
  })

})



app.get("/artists/:artist/albums", (req, res) => {
  console.log("#############")
  const artistName = req.params.artist
  let response = {};
  let s3Promise = s3.listAlbums(artistName)
  let albumDetailsPromises = []
  let endProm = []

  s3Promise
    .then((data) => {
      data.map((album) => {
        console.log(album)
        // Build an Array of promises that will first fetch the albumId, then use
        // that album id to fetch the details on the album
        albumDetailsPromises.push(
          discogs.getAlbumId(artistName, album).then(
            ({ data }) => {
              let masterId = data.results[0].id
              let recordName = data.results[0].title
              console.log(masterId, recordName)

              // Storing the album name as it appears in S3
              return [album, discogs.getAlbumDetails(masterId)]
            }
          )
        )
      })
    })
    .then(() => {
      // When all the albumIds have been fetched, there will still exist a promise in the 
      // second index of each element in the albumDetailsPromises array
      Promise.all(albumDetailsPromises)
        .then((namedPromises) => {
          console.log("we're here")
          console.log(namedPromises)
          namedPromises.map(
            (album) => {
              let albumName = album[0]
              let albumDetailPromise = album[1]
              // Resolving the albumDetailsPromise here, and storing the value on
              // a response object that we intend to send as the express response
              albumDetailPromise
                .then(
                  ({ data }) => {
                    response[albumName] = data
                    console.log("Editing response object")
                  })
                .catch(err => response[albumName] = err)
            })

        })


    })
    .then(() => {
      Promise.all(endProm).then(res.send(response))
    })
    .catch((err) => console.log(err))




  // s3Promise.then((data) => {
  //   data.map((album) => {
  //     console.log(album)
  //     discogs.getAlbumId(artistName, album)
  //       .then(({ data }) => {

  //         let masterId = data.results[0].id
  //         let recordName = data.results[0].title
  //         console.log(masterId, recordName)
  //         discogs.getAlbumDetails(masterId)
  //           .then(({ data }) => {
  //             response[album] = data
  //             res.send(response)
  //           })

  //           .catch(err => {
  //             response[album] = err.message
  //             console.log(err.message)

  //           })
  //           .catch(err => console.log(err))
  //       })
  //       .catch(err => {
  //         console.log(err)
  //       })
  //   });
  // })
})



app.get("/artists/:artist/albums/:album/songs", (req, res) => {
  let albumPath = `${req.params.artist}/${req.params.album}`
  s3.listSongs(albumPath, (err, data) => {
    if (err) {
      res.send(err)
    }
    else { res.send(data) }
  })
})


app.get("/artists/:artist/albums/:album/songs/:song/play", (req, res) => {
  songPath = `${req.params.artist}/${req.params.album}/${req.params.song}`
  let downloadStream = s3.playMusic(songPath);
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

