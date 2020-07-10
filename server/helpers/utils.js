function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function normalizeSongName(songTarget) {
  let songName = songTarget.split(".")[0]
  return songName
}

module.exports = { sleep, normalizeSongName }