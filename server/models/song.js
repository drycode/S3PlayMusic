const { s3Client } = require("../clients/aws_client.js")
const logger = require("../lib/logger.js")

const { nullSong } = require("../models/null_responses.js")
const songMap = require("../middlewares/normalize.js")


class Song {
  async getSongsByAlbum(albumPath) {
    let songs = await s3Client.listSongs(albumPath)
    for (let i = 0; i < songs.length; i++) {
      const song = songs[i]
      const normalizedSong = songMap.putSongTarget(song)
      songs[i] = normalizedSong
    }
    return songs
  }

  async downloadAudioFile(artist, album, song, res) {
    const songTarget = songMap.getSongTarget(song)
    const songPath = `${artist}/${album}/${songTarget}`
    let downloadStream = s3Client.playMusic(songPath);
    logger.info("Request for song initiated")
    res.set('content-type', 'audio/mp3');
    res.set('accept-ranges', 'bytes');

    downloadStream.on('error', (err) => {
      if (err.code === "NoSuchKey") {
        logger.error(err)
        setTimeout(() => {
          downloadStream.emit('end');
        }, 20);
      }
    });

    downloadStream.on('data', (chunk) => {
      res.write(chunk);
      logger.debug("Rendering chunk...")
    });

    downloadStream.on('end', () => {
      logger.info("Download Complete.")
      res.end();
    });
  }
}


module.exports = new Song()

