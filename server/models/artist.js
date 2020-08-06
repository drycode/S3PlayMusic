const { s3Client } = require("../clients/aws_client.js");
const logger = require("../lib/logger.js");

class Artist {
  async getAll(limit = 10, page = 2) {
    let response = {};
    let data = await s3Client.listArtists();

    // const promises = data.map(async (artist) => {
    const promises = data
      .slice(limit * page, limit * page + limit)
      .map(async (artist) => {
        return [artist, await s3Client.getArtistCache(artist)];
      });
    const responses = await Promise.all(promises);
    responses.map((data) => {
      // TODO: Clean up
      logger.debug(data[1]);
      delete data[1].master_id;
      delete data[1].master_url;
      delete data[1].uri;
      delete data[1].user_data;
      response[data[0]] = data[1];
    });
    return response;
  }
}

module.exports = new Artist();
