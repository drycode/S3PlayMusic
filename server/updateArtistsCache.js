const { S3Client } = require("./clients/aws_client");

const { s3Client, S3Client } = require("./clients/aws_client");
const discogs = require("./clients/discogs_client");

async function updateArtistCache() {
  s3Client.listArtists(async (err, artists) => {
    for (let i = 0; i < artists.length; i++) {
      let details = await discogs.getArtistDetails(artists[i]);
      if (details[0] === undefined) {
        logger.debug(artists[i]);
        details = nullArtist;
      }
      await sleep(2000);
      let artist = S3Client.normalizeArtistName(artists[i]);
      res = await s3Client.putArtistCache(artist, details);
      logger.debug(i, res);
    }
  });
}
updateArtistCache();
