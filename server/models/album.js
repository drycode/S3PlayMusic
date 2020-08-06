const { s3Client } = require("../clients/aws_client.js");
const logger = require("../lib/logger.js");

const { nullAlbum } = require("../models/null_responses.js");

class Album {
  async getAlbumsByArtist(artistName) {
    let response = {};

    let albums = await s3Client.listAlbums(artistName);
    const promises = albums.map(async (album) => {
      let result = await discogs.getAlbumId(artistName, album);
      try {
        let masterId = result.data.results[0].id;
        let tempRes = await discogs.getAlbumDetails(masterId);
        if (!tempRes) {
          return [album, nullAlbum];
        }
        return [album, tempRes.data];
      } catch (error) {
        logger.error(error);
        return [album, nullAlbum];
      }
    });

    const responses = await Promise.all(promises);
    responses.map((data) => {
      response[data[0]] = data[1];
    });
    return response;
  }
}

module.exports = new Album();
