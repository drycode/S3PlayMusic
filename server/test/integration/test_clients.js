const stream = require('stream');

const assert = require("assert")
const logger = require("../../lib/logger")
const { s3Client, S3Client } = require("../../clients/aws_client");

const sinon = require("sinon");


function isReadableStream(obj) {
  return obj instanceof stream.Stream &&
    typeof (obj._read === 'function') &&
    typeof (obj._readableState === 'object');
}

describe('testAwsClient', () => {
  before(() => {
    sinon.replace(logger, 'info', sinon.fake());
  })
  describe("getArtistCache", () => {
    it("Checks exists in cache", async () => {
      let res = await s3Client.getArtistCache("Led Zeppelin")
      assert.deepEqual(Object.keys(res), [
        "id",
        "type",
        "user_data",
        "master_id",
        "master_url",
        "uri",
        "title",
        "thumb",
        "cover_image",
        "resource_url"
      ])
    })
    it("Checks NOT exists in cache", async () => {
      call = async () => await s3Client.getArtistCache("abcdefg")
      assert.rejects(call)
    })
  });
  describe("putArtistCache", () => {
    const tmpFilePath = "zzztmpe382349TEST"
    it("Checks successful put", async () => {
      let res = await s3Client.putArtistCache(tmpFilePath, { test: "object" })
      assert.deepEqual(res, { status: 200 })
    })
    it("Checks unsuccessful put", async () => {
      call = async () => await s3Client.putArtistCache(tmpFilePath, { test: "object" }, "12345")
      assert.rejects(call)
    })
  });
  describe("listArtists", () => {
    it("Checks bucket not empty", async () => {
      let res = await s3Client.listArtists()
      assert.notEqual(res.length, 0)
    });
  });
  describe("listAlbums", () => {
    it("Check Albums for existing Artist", async () => {
      const res = await s3Client.listAlbums("John Coltrane")
      assert(res.includes("A Love Supreme [Verve Reissue]"))
    });
    it("Check Albums for non-existing Artist", async () => {
      const res = await s3Client.listAlbums("ALKDJGIE2345")
      assert(Array.isArray(res))
      assert(res.length === 0)
    });
  });
  describe("playMusic", () => {
    it("Checks existing song returns buffer", async () => {
      let bufferStream = s3Client.playMusic("Dick Oatts/Standard Issue/03 All The Things You Are.m4a")
      console.log(typeof bufferStream._read)
      assert(isReadableStream(bufferStream))
    })
    it("Checks non-existing song", async () => {

    })
  });
  after(() => {
    sinon.restore()
  });
})
