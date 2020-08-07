const assert = require("assert");

const { normalizeSongName } = require("../../helpers/utils");

describe("Test Helpers", function () {
  describe("normalizeSongName", () => {
    it("Should return a normalized string", () => {
      assert.equal(normalizeSongName("Hello.mp3"), "Hello");
      assert.equal(normalizeSongName("04 New Monastery.mp3"), "New Monastery");
      assert.equal(normalizeSongName("06 T.C..mp3", "New Monastery"), "T.C.");
      assert.equal(normalizeSongName("07 15_8.mp3", "New Monastery"), "15/8");
    });
  });
});
