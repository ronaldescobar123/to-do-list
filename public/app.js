function TaskItem({ tarea, onCompletar, onFallar, onEliminar }) {
  const clase =
    tarea.estado === "completado"
      ? "verde"
      : tarea.estado === "no-completado"
      ? "rojo"
      : "";

  const fecha = new Date(tarea.fechaCreacion).toLocaleDateString("es-ES");

  return (
    <div className={`tarea ${clase}`}>
      <div className="tarea-info">
        <span className="tarea-texto">{tarea.texto}</span>
        <div className="tarea-meta">
          <span className="badge prioridad">{tarea.prioridad}</span>
          <span className="badge categoria">{tarea.categoria}</span>
          <span className="fecha">{fecha}</span>
        </div>
      </div>
      <div className="tarea-botones">
        <button onClick={() => onCompletar(tarea._id)}>✓</button>
        <button onClick={() => onFallar(tarea._id)}>✕</button>
        <button className="eliminar" onClick={() => onEliminar(tarea._id)}>X</button>
      </div>
    </div>
  );
}

function TaskList({ tareas, onCompletar, onFallar, onEliminar }) {
  return (
    <section id="listaTareas">
      {tareas.map((tarea) => (
        <TaskItem
          key={tarea._id}
          tarea={tarea}
          onCompletar={onCompletar}
          onFallar={onFallar}
          onEliminar={onEliminar}
        />
      ))}
    </section>
  );
}

function App() {
  const [texto, setTexto] = React.useState("");
  const [prioridad, setPrioridad] = React.useState("media");
  const [categoria, setCategoria] = React.useState("general");
  const [tareas, setTareas] = React.useState([]);
  const [usuario, setUsuario] = React.useState(null);
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [errorLogin, setErrorLogin] = React.useState("");

  const cargarTareas = React.useCallback(async () => {
    try {
      const res = await fetch("/tareas");
      const datos = await res.json();
      setTareas(datos);
    } catch (err) {
      console.error("Error al cargar tareas:", err);
    }
  }, []);

  React.useEffect(() => {
    if (usuario) {
      cargarTareas();
    }
  }, [cargarTareas, usuario]);

  const handleLogin = (e) => {
    e.preventDefault();
    if (!username || !password) {
      setErrorLogin("Por favor completa todos los campos");
      return;
    }
    if (username === "admin" && password === "1234") {
      setUsuario({ nombre: username });
      setErrorLogin("");
      setUsername("");
      setPassword("");
    } else {
      setErrorLogin("Usuario o contraseña incorrectos");
    }
  };

  const logout = () => {
    setUsuario(null);
    setTareas([]);
    setUsername("");
    setPassword("");
  };

  const agregarTarea = async (e) => {
    e.preventDefault();
    if (!texto.trim()) {
      alert("Escribe una tarea");
      return;
    }
    try {
      await fetch("/tareas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          texto,
          estado: "pendiente",
          prioridad,
          categoria
        })
      });
      setTexto("");
      setPrioridad("media");
      setCategoria("general");
      cargarTareas();
    } catch (err) {
      console.error("Error al agregar tarea:", err);
    }
  };

  const completarTarea = async (id) => {
    try {
      await fetch("/tareas/" + id, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ estado: "completado" })
      });
      cargarTareas();
    } catch (err) {
      console.error(err);
    }
  };

  const fallarTarea = async (id) => {
    try {
      await fetch("/tareas/" + id, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ estado: "no-completado" })
      });
      cargarTareas();
    } catch (err) {
      console.error(err);
    }
  };

  const eliminarTarea = async (id) => {
    try {
      await fetch("/tareas/" + id, { method: "DELETE" });
      cargarTareas();
    } catch (err) {
      console.error(err);
    }
  };

  if (!usuario) {
    return (
      <main className="contenedor login-page">
        <div className="login-container">
          <h2>Iniciar Sesión</h2>
          <form onSubmit={handleLogin}>
            <div className="input-group">
              <label>Usuario:</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Ingresa tu usuario"
              />
            </div>
            <div className="input-group">
              <label>Contraseña:</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Ingresa tu contraseña"
              />
            </div>
            {errorLogin && <p className="error-login">{errorLogin}</p>}
            <button type="submit" className="btn-login">Entrar</button>
          </form>
        </div>
      </main>
    );
  }

  return (
    <main className="contenedor">
      <div className="header-user">
        <button onClick={logout} className="btn-logout">Cerrar Sesión</button>
      </div>
      <h1>To-Do List</h1>
      <form className="formulario" onSubmit={agregarTarea}>
        <input
          type="text"
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          placeholder="Escribe una tarea"
        />
        <select value={prioridad} onChange={(e) => setPrioridad(e.target.value)}>
          <option value="alta">Alta</option>
          <option value="media">Media</option>
          <option value="baja">Baja</option>
        </select>
        <select value={categoria} onChange={(e) => setCategoria(e.target.value)}>
          <option value="trabajo">Trabajo</option>
          <option value="estudio">Estudio</option>
          <option value="personal">Personal</option>
          <option value="general">General</option>
        </select>
        <button type="submit">Agregar</button>
      </form>
      <TaskList
        tareas={tareas}
        onCompletar={completarTarea}
        onFallar={fallarTarea}
        onEliminar={eliminarTarea}
      />
    </main>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);