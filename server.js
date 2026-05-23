const express = require("express");

const app = express();

app.use(express.static("public"));

app.use(express.json());

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

app.listen(3000, () => {
  console.log("Servidor funcionando");
});