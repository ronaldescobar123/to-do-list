const express = require("express");
const mongoose = require("mongoose");
const Tarea = require("./models/Tarea");

const dns = require("dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);

mongoose.connect(
  "mongodb+srv://ronald:JrSOmjZX4Jj5tlh1@to-do-list.mc5r7mn.mongodb.net/todolist?retryWrites=true&w=majority&appName=to-do-list"
)
.then(() => {
  console.log("MongoDB conectado");
})
.catch((error) => {
  console.log("Error de conexión:", error.message);
});

const app = express();

app.use(express.json());
app.use(express.static("public"));

// GET - obtener todas las tareas desde MongoDB
app.get("/tareas", async function(req, res) {
  try {
    const tareas = await Tarea.find();
    res.json(tareas);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST - guardar nueva tarea en MongoDB
app.post("/tareas", async function(req, res) {
  try {
    const nuevaTarea = new Tarea({
      texto: req.body.texto,
      estado: req.body.estado || "pendiente"
    });
    await nuevaTarea.save();
    res.json({ mensaje: "Tarea guardada" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT - actualizar estado usando el _id de MongoDB
app.put("/tareas/:id", async function(req, res) {
  try {
    await Tarea.findByIdAndUpdate(req.params.id, {
      estado: req.body.estado
    });
    res.json({ mensaje: "Estado actualizado" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE - eliminar tarea usando el _id de MongoDB
app.delete("/tareas/:id", async function(req, res) {
  try {
    await Tarea.findByIdAndDelete(req.params.id);
    res.json({ mensaje: "Tarea eliminada" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(3000, () => {
  console.log("Servidor funcionando en http://localhost:3000");
});