const ss = require("socket.io-stream");
const server = http.createServer(app);
const io = require("socket.io").listen(server);

io.on("connection", (client) => {
  const stream = ss.createStream();
  client.on("track", () => {
    const filePath = path.resolve(__dirname, "./private", "./track.wav");
    // get file info
    const stat = fileSystem.statSync(filePath);
    const readStream = fileSystem.createReadStream(filePath);
    // pipe stream with response stream
    readStream.pipe(stream);
    ss(client).emit("track-stream", stream, { stat });
  });
});
