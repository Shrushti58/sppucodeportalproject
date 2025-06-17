const mongoose = require('mongoose');
const config = require("config");
const dbgr = require("debug")("development:mongoose");

mongoose.connect(config.get("MONGODB_URI"), {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log("Database Connection Done!");
  dbgr("Connected!");
})
.catch((err) => {
  dbgr("MongoDB Error:", err);
});

module.exports = mongoose.connection;
