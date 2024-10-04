const express = require("express");
const http = require("http");
const socketio = require("socket.io");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const locatioRoutes = require("./routes/location");

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = socketio(server);

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB Connected!"))
  .catch((err) => console.log(err));

const port = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("hello");
});
app.use("/api", locatioRoutes);

server.listen(port, () => console.log(`Server running on port ${port}`));

io.on("connection", (socket) => {
  console.log("New device connected", socket.id);

  socket.on("locationUpdate", (data) => {
    console.log("Received location update:", data);

    io.emit("updateLocation", data);
  });
  socket.on("disconnect", () => {
    console.log("Device disconnected", socket.id);
  });
});
