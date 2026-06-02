const mongoose = require("mongoose");

const tareaSchema = new mongoose.Schema({
  texto: String,
  estado: String
});

module.exports = mongoose.model(
  "Tarea",
  tareaSchema
);