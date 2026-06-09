const mongoose = require("mongoose");

const tareaSchema = new mongoose.Schema({
  texto: String,
  estado: String,
  fechaCreacion: {
    type: Date,
    default: Date.now
  },
  prioridad: {
    type: String,
    default: "media"
  },
  categoria: {
    type: String,
    default: "general"
  }
});

module.exports = mongoose.model("Tarea", tareaSchema);