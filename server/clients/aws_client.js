const nullArtist = require("./null_responses");

const AWS = require("aws-sdk");
const config = require('../config');


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
    }
  }

  /**
   * Requests the artist information from the s3 cache
   * @param {string} artistName The artistName, as it exists in the music files bucket 
   * @param {*} cacheBucket The name of the bucket used for caching the DiscogsAPI response
   */
  async getArtistCache(artistName, cacheBucket = "discogs-api-cache") {
    let params = {
      Bucket: cacheBucket,
      Prefix: `artists/${S3Client.normalizeArtistName(artistName)}`
    }

    return new Promise((resolve, reject) => {
      try {
        let key = `artists/${S3Client.normalizeArtistName(artistName)}`
        this.client.getObject({ Bucket: cacheBucket, Key: key }, (err, res) => {
          if (err) {
            reject(err)
          } else {
            resolve(JSON.parse(res.Body.toString("utf-8")))
          }
        })
      } catch (err) {
        if (err instanceof TypeError) {
          resolve(nullArtist)
        } else {
          console.error(err)
        }
      }
    })
  }

  /**
   * 
   * @param {string} artistName The artistName, as it exists in the music files bucket 
   * @param {Object} jsonObj The jsonFile in object form to be pushed to s3
   * @param {*} cacheBucket The name of the bucket used for caching the DiscogsAPI response 
   */
  putArtistCache(artistName, jsonObj, cacheBucket = "discogs-api-cache") {
    const params = {
      Bucket: cacheBucket,
      Key: `artists/${S3Client.normalizeArtistName(artistName)}.json`,
      Body: Buffer.from(JSON.stringify(jsonObj), "binary")
    }

    return new Promise((resolve, reject) => {
      this.client.putObject(params, (err, res) => {
        if (err) {
          reject(err)
        }
        resolve(res)
      })
    })
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
    return new Promise((resolve, reject) => {
      this.client.listObjectsV2(params, (err, res) => {
        if (err) {
          return reject(err)
        }
        this.albumNames = []
        res.CommonPrefixes.forEach(
          (obj) => {
            let albumName = obj.Prefix.split("/")
            albumName = albumName[albumName.length - 2]
            this.albumNames.push(albumName)
          })
        console.log(`S3 List Objects Call made: listing ${artistPath} albums`)
        resolve(this.albumNames)
      })
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
    return this.client.getObject(params).createReadStream()
  }

  static normalizeArtistName(artistName) {
    return artistName.replace(/ /g, "-").replace(/\//g, "")
  }
}

const s3Client = new S3Client()
// s3Client.putArtistCache("Led Zeppelin").then(res => console.log(res))
// s3Client.getArtistCache("Led Zeppelin").then(res => {
//   console.log(res)
// })


module.exports = { s3Client, S3Client }