const nullArtist = require("./null_responses")
const fs = require("fs");
const config = require("../config");
const sleep = require("../helpers/utils")
const axios = require("axios");
const { s3Client, S3Client } = require("./aws_client")
const logger = require("../lib/logger")

const accessKey = fs.readFileSync(config.discogsAccessTokenPath, "utf-8").split(" = ")[1].trim()

// axios.defaults.headers.common['Authorization'] = `Discogs token=${accessKey}`

class DiscogsClient {
  constructor(accessTokenPath = config.discogsAccessTokenPath) {
    this.axios = axios
    this.accessKey = fs.readFileSync(accessTokenPath, "utf-8").split(" = ")[1].trim()
    this.axios.defaults.headers.common['Authorization'] = `Discogs token=${accessKey}`
  }

  getAlbumId(artist, album) {
    let artistName = encodeURI(artist)
    let albumName = encodeURI(album)
    return new Promise((resolve, reject) => {
      this.axios.get(`https://api.discogs.com/database/search?q=${albumName}&type=album&artist=${artistName}`)
        .then((data) => {
          resolve(data)
        })
        .catch(err => {
          reject(err)
        })
    })
  }

  getAlbumDetails(masterId) {
    return new Promise((resolve, reject) => {
      this.axios.get(`https://api.discogs.com/masters/${masterId}`)
        .then((data) => {
          resolve(data)
          logger.debug(data)
        })
        .catch((err) => {
          reject(err)
        })
    })
  }

  async getArtistDetails(artist) {
    let { data } = await this.axios.get(`https://api.discogs.com/database/search?q=${artist}&type=artist`)
    if (data.results) {
      return data.results
    } else {
      return nullArtist
    }
  }
}

discogs = new DiscogsClient()


async function updateArtistCache() {
  s3Client.listArtists(async (err, artists) => {
    for (let i = 0; i < artists.length; i++) {

      let details = await discogs.getArtistDetails(artists[i])
      if (details[0] === undefined) {
        logger.debug(artists[i])
        details[0] = nullArtist
      }
      await sleep(2000)
      let artist = S3Client.normalizeArtistName(artists[i])
      res = await s3Client.putArtistCache(artist, details[0])
      logger.debug(i, res)
    }
  })

}
// updateArtistCache()
// discogs.getArtistDetails("123;4lkjd9n")
// getAlbumId("Led Zeppelin", "In Through the Out Door")
module.exports = discogs