const AWS = require("aws-sdk")
const config = require('./config');

class S3Client {
  constructor() {
    AWS.config.credentials = new AWS.SharedIniFileCredentials({ profile: 'laptop-admin-user' })
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
      for (let i in res.CommonPrefixes) {
        this.artistNames.push(res.CommonPrefixes[i].Prefix)
      }
      callback(this.artistNames)
    })
  }

  listAlbums(artistPath, callback) {
    let params = this.baseParams
    params.Prefix = artistPath + "/"
    this.client.listObjectsV2(params, (err, res) => {
      if (!this.albumNames.length) {
        this.albumNames = []
        res.CommonPrefixes.forEach(
          (obj) => {
            this.albumNames.push(obj.Prefix)
          })
      }
      callback(this.albumNames)
    })
  }

  listSongs(albumPath, callback) {
    let params = this.baseParams
    params.Prefix = albumPath + "/"
    this.client.listObjectsV2(params, (err, res) => {
      if (!this.songPaths.length) {
        this.songPaths = []
        res.Contents.forEach(
          (obj) => {
            this.songPaths.push(obj.Key)
          })
      }
      callback(this.songPaths)
    })
  }

  playMusic(songPath) {
    let params = {Bucket: config.bucket}
    params.Key = songPath;
    return this.client.getObject(params).createReadStream()
}}


module.exports = new S3Client()