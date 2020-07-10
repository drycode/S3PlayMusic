const logger = require("../lib/logger");
const { normalizeSongName } = require("../helpers/utils")


class SongMap {
  constructor() {
    this.songMap = {}
  }

  getSongName(songName) {
    const songTarget = this.songMap[songName]
    if (!songTarget) {
      logger.error("Invalid song name from client")
    }
  }

  putSongName(songTarget) {
    const songName = normalizeSongName(songTarget)
    this.songMap[songName] = songTarget
    logger.debug(`${songName}:${songTarget} added to songMap.`)
  }
}

module.exports = new SongMap()