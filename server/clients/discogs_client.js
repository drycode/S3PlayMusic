const { nullArtist, nullAlbum } = require("../models/null_responses");
const fs = require("fs");
const config = require("../config");
const { sleep } = require("../helpers/utils");
const axios = require("axios");
const { s3Client, S3Client } = require("./aws_client");
const logger = require("../lib/logger");

// axios.defaults.headers.common['Authorization'] = `Discogs token=${accessKey}`

class DiscogsClient {
  constructor(accessTokenPath = config.discogsAccessTokenPath) {
    this.axios = axios;
    this.accessKey = this.getDiscogsToken();
    this.axios.defaults.headers.common[
      "Authorization"
    ] = `Discogs token=${this.accessKey}`;
  }

  getDiscogsToken() {
    const accessKey = fs
      .readFileSync(config.discogsAccessTokenPath, "utf-8")
      .split(" = ")[1]
      .trim();
    return accessKey;
  }

  /**
   * Returns the album Id for discogs API's best guess, or first result, given the params
   */
  async getAlbumId(artist, album) {
    const checkArgs = () => {
      let missingArgs = 2;
      if (!(artist && album)) {
        missingArgs = !artist ? (missingArgs += 1) : missingArgs;
        missingArgs = !album ? (missingArgs += 1) : missingArgs;
        return missingArgs;
      }
      return null;
    };
    let artistName = encodeURI(artist);
    let albumName = encodeURI(album);

    const missingArgs = checkArgs();
    const promise = new Promise((resolve, reject) => {
      if (missingArgs) {
        reject(
          new TypeError(
            `getAlbumId requires at least 2 arguments, but only ${missingArgs} were passed`
          )
        );
      }
      this.axios
        .get(
          `https://api.discogs.com/database/search?q=${albumName}&type=album&artist=${artistName}`
        )
        .then((res) => {
          const topResult = res.data.results[0];
          if (topResult) {
            resolve(topResult.id);
          }
          resolve(null);
        })
        .catch((err) => {
          reject(err);
        });
    });
    return promise;
  }

  getAlbumDetails(masterId) {
    return new Promise((resolve, reject) => {
      this.axios
        .get(`https://api.discogs.com/masters/${masterId}`)
        .then((data) => {
          resolve(data);
          logger.debug(data);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  /**
   * Returns the best guess artist details from the discogs API
   */
  async getArtistDetails(artist) {
    let { data } = await this.axios.get(
      `https://api.discogs.com/database/search?q=${artist}&type=artist`
    );
    if (data.results) {
      return data.results[0];
    } else {
      return null;
    }
  }
}

discogs = new DiscogsClient();

module.exports = discogs;
