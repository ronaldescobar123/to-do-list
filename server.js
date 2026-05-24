const express = require("express");

const app = express();

app.use(express.json());

app.use(express.static("public"));

let tareas = [];

app.get("/tareas", function(req, res){
  res.json(tareas);
});

app.post("/tareas", function(req, res){

  const nuevaTarea = req.body;

  tareas.push(nuevaTarea);

  res.json({
    mensaje: "Tarea guardada"
  });

});

app.put("/tareas/:id", function(req, res){

  const id = req.params.id;

  const nuevoEstado = req.body.estado;

  tareas[id].estado = nuevoEstado;

  res.json({
    mensaje: "Estado actualizado"
  });

});

app.delete("/tareas/:id", function(req, res){

  const id = req.params.id;

  tareas.splice(id, 1);

  res.json({
    mensaje: "Tarea eliminada"
  });

});

app.listen(3000, () => {
  console.log("Servidor funcionando");
});