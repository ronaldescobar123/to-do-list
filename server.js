require("dotenv").config({ quiet: true });
const dns = require("dns");
dns.setServers(["8.8.8.8", "8.8.4.4", "1.1.1.1", "208.67.222.222"]);

const https = require("https");
const fs = require("fs");
const express = require("express");
const mongoose = require("mongoose");
const Tarea = require("./models/Tarea");
const bcrypt = require("bcryptjs");
const Usuario = require("./models/Usuario");
const jwt = require("jsonwebtoken");

mongoose.connect(process.env.MONGODB_URI)
.then(() => {
  console.log("MongoDB conectado");
})
.catch((error) => {
  console.log("Error de conexión:", error.message);
});

const app = express();

app.use(express.json());
app.use(express.static("public"));

function verificarToken(req, res, next) {
  const token = req.headers["authorization"];

  if (!token) {
    return res.status(401).json({ error: "Acceso denegado, token requerido" });
  }

  try {
    const tokenLimpio = token.replace("Bearer ", "");
    const datos = jwt.verify(tokenLimpio, process.env.JWT_SECRET);
    req.usuario = datos;
    next();
  } catch (error) {
    return res.status(401).json({ error: "Token inválido o expirado" });
  }
}

app.get("/tareas", verificarToken, async function(req, res) {
  try {
    const tareas = await Tarea.find();
    res.json(tareas);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/tareas", verificarToken, async function(req, res) {
  try {
    const nuevaTarea = new Tarea({
      texto: req.body.texto,
      estado: req.body.estado || "pendiente",
      prioridad: req.body.prioridad || "media",
      categoria: req.body.categoria || "general"
    });
    await nuevaTarea.save();
    res.json({ mensaje: "Tarea guardada" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put("/tareas/:id", verificarToken, async function(req, res) {
  try {
    await Tarea.findByIdAndUpdate(req.params.id, {
      estado: req.body.estado
    });
    res.json({ mensaje: "Estado actualizado" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete("/tareas/:id", verificarToken, async function(req, res) {
  try {
    await Tarea.findByIdAndDelete(req.params.id);
    res.json({ mensaje: "Tarea eliminada" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/registro", async function(req, res) {
  try {
    const { username, password } = req.body;

    const existe = await Usuario.findOne({ username });
    if (existe) {
      return res.status(400).json({ error: "El usuario ya existe" });
    }

    const passwordEncriptada = await bcrypt.hash(password, 10);

    const nuevoUsuario = new Usuario({
      username,
      password: passwordEncriptada
    });

    await nuevoUsuario.save();
    res.json({ mensaje: "Usuario registrado correctamente" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/login", async function(req, res) {
  try {
    const { username, password } = req.body;

    const usuario = await Usuario.findOne({ username });
    if (!usuario) {
      return res.status(400).json({ error: "Usuario o contraseña incorrectos" });
    }

    const passwordCorrecta = await bcrypt.compare(password, usuario.password);
    if (!passwordCorrecta) {
      return res.status(400).json({ error: "Usuario o contraseña incorrectos" });
    }

    const token = jwt.sign(
      { username: usuario.username },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    res.json({ mensaje: "Login exitoso", username: usuario.username, token: token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const options = {
  key: fs.readFileSync("key.pem"),
  cert: fs.readFileSync("cert.pem")
};

https.createServer(options, app).listen(3000, () => {
  console.log("Servidor funcionando en https://localhost:3000");
});