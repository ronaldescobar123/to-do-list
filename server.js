const express = require("express");

const app = express();

app.use(express.static("public"));

let tareas = [];

app.get("/tareas", function(req, res){
  res.json(tareas);
});

app.listen(3000, () => {
  console.log("Servidor funcionando");
});