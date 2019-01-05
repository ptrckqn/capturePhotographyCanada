var mongoose = require("mongoose");

var imageSchema = new mongoose.Schema({
  path: String,
  tag: String,
  public_id: String
});

module.exports = mongoose.model("Image", imageSchema);
