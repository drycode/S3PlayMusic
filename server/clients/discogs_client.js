const fs = require("fs");
const axios = require("axios");

const accessKey = fs.readFileSync("/Users/danyoung/.discogs/credentials", "utf-8").split(" = ")[1].trim()

// axios.defaults.headers.common['Authorization'] = `Discogs token=${accessKey}`

class DiscogsClient {
  constructor(accessTokenPath = "/Users/danyoung/.discogs/credentials") {
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

  // async getAlbumDetails(artist, album, res) {
  //   let artistName = encodeURI(artist)
  //   let albumName = encodeURI(album)

  //   return this.axios.get(`https://api.discogs.com/database/search?q=${albumName}&type=album&artist=${artistName}`)
  //     .then(({ data }) => {
  //       this.axios.get(`https://api.discogs.com/masters/${data.results[0].id}`)
  //         .then(({ data }) => {
  //           res.discogs = data;
  //         })
  //         .catch((err) => {
  //           console.log(err)
  //           // console.log(response.status);
  //         })
  //     })
  // }

  getAlbumDetails(masterId) {
    return new Promise((resolve, reject) => {
      this.axios.get(`https://api.discogs.com/masters/${masterId}`)
        .then((data) => {
          resolve(data)
        })
        .catch((err) => {
          reject(err)
        })
    })
  }

  async asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
      await callback(array[index], index, array);
    }
  }
}

// getAlbumId("Led Zeppelin", "In Through the Out Door")
module.exports = new DiscogsClient()