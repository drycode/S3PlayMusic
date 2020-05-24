const AWS = require("aws-sdk");
const config = require('./config');

class S3Client {
  constructor() {
    AWS.config.credentials = new AWS.SharedIniFileCredentials({ profile: config.profile })
    this.client = new AWS.S3();
    this.artistNames = [];
    this.albumNames = [];
    this.songPaths = [];
    this.baseParams = {
      Bucket: config.bucket, /* required */
      Delimiter: '/',
      // Prefix: 'STRING_VALUE',
    }
  }

  listArtists(callback) {
    this.client.listObjectsV2(this.baseParams, (err, res) => {
      if (err) {
        callback(err)
      }
      else {
        if (this.artistNames.length == 0) {
          console.log("S3 List Objects Call made: listing artists")
          for (let i in res.CommonPrefixes) {
            this.artistNames.push(res.CommonPrefixes[i].Prefix)
          }

        }
        callback(err, this.artistNames)
      }

    })
  }

  listAlbums(artistPath, callback) {
    let params = this.baseParams
    params.Prefix = artistPath + "/"
    this.client.listObjectsV2(params, (err, res) => {
      if (err) {
        callback(err)
      }
      else {
        this.albumNames = []
        res.CommonPrefixes.forEach(
          (obj) => {
            let albumName = obj.Prefix.split("/")
            albumName = albumName[albumName.length - 2]
            this.albumNames.push(albumName)
          })
        console.log(`S3 List Objects Call made: listing ${artistPath} albums`)
        callback(err, this.albumNames)
      }
    })
  }

  listSongs(albumPath, callback) {
    let params = this.baseParams
    params.Prefix = albumPath + "/"
    this.client.listObjectsV2(params, (err, res) => {
      if (err) {
        callback(err)
      }
      else {
        this.songPaths = []
        res.Contents.forEach(
          (obj) => {
            let songName = obj.Key.split("/")
            songName = songName[songName.length - 1]
            if (songName) { this.songPaths.push(songName) }
          })
        callback(err, this.songPaths)
      }
    })
  }

  playMusic(songPath) {
    let params = { Bucket: config.bucket, Key: songPath }
    // params.Key = "Ahmad Jamal/Ahmad's Blues/02 It Could Happen to You.mp3";
    return this.client.getObject(params).createReadStream()
  }
}


module.exports = new S3Client()