function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function normalizeSongName(songTarget) {
  let songName = songTarget;
  // (?<number>(?<=\b)\d+(?= )) # Matches number at the beginning of song name
  // (\.[A-z]{2,4}\d\b) # Matches extensions
  const number = songName.match(/(?<=\b)\d+ (?=)/g);
  const ext = songName.match(/\.[A-z]{2,4}\d*\b/g);
  const fraction = songName.match(/\d{1,2}_\d{1,2}/g);

  if (number) {
    songName = songName.replace(number, "");
  }

  if (ext) {
    songName = songName.replace(ext, "");
  }

  if (fraction) {
    const replacement = fraction[0].replace("_", "/");
    songName = songName.replace(fraction, replacement);
  }

  return songName;
}

module.exports = { sleep, normalizeSongName };
