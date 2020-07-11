const logger = require("../lib/logger");
const { normalizeSongName } = require("../helpers/utils")


class SongMap {
  constructor() {
    this.songMap = {}
  }

  getSongTarget(songName) {
    const songTarget = this.songMap[songName]
    if (!songTarget) {
      logger.error("Invalid song name from client")
    }
    return songTarget
  }

  putSongTarget(songTarget) {
    const songName = normalizeSongName(songTarget)
    this.songMap[songName] = songTarget
    logger.debug(`${songName}:${songTarget} added to songMap.`)
    return songName
  }
}

module.exports = new SongMap()