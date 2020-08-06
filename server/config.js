const dotenv = require("dotenv");

dotenv.config();

const CONFIG = {
  bucket: "daniels-music",
  profile: process.env.AWS_PROFILE_NAME,
  discogsAccessTokenPath: process.env.DISCOGS_ACCESS_TOKEN_PATH,
};

module.exports = CONFIG;
