const logger = require("../lib/logger.js")


class ServerCache {
  constructor(TTL = 0) {
    this.data = {}
    this.TTL = TTL * 1000;
  }

  get(path) {
    let cacheResult = this.data[path]
    if (cacheResult && (cacheResult.last_updated > Date.now() - this.TTL)) {
      logger.info("Retrieving cached response...")
      return cacheResult.data
    }
  }

  put(path, response) {
    logger.info("Updating cache...")
    this.data[path] = {}
    this.data[path].data = response
    this.data[path].last_updated = Date.now()
  }

}

cache = new ServerCache()

let cacheMiddleware = () => {
  return (req, res, next) => {
    let key = '__express__' + req.originalUrl || req.url
    let cacheContent = cache.get(key);
    if (cacheContent) {
      res.send(cacheContent);
      return
    } else {
      res.sendResponse = res.send
      res.send = (body) => {
        cache.put(key, body);
        res.sendResponse(body)
      }
      next()
    }
  }
}

module.exports = cacheMiddleware
