// Schema and Model
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const testSchema = new Schema({
  name: String,
  age: Number,
  location: String,
  subject: String,
});

module.exports = mongoose.model("TestModel", testSchema);
