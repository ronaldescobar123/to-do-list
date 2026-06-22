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
function DriveSection({ archivos, onSubirArchivos, onDescargar, onEliminarArchivo }) {
  const handleDrop = (e) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      onSubirArchivos(files);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  return (
    <section className="drive-section">
      <div className="drive-header">
        <h2>Mi Drive</h2>
      </div>

      <div 
        className="upload-area"
        onClick={() => document.getElementById("fileInput").click()}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        <h3>Subir Archivos</h3>
        <p style={{ color: "#777", marginTop: "8px", fontSize: "15px" }}>
          Arrastra archivos o haz clic
        </p>
      </div>

      <input
        type="file"
        id="fileInput"
        multiple
        style={{ display: "none" }}
        onChange={(e) => onSubirArchivos(e.target.files)}
      />

      <div className="file-list">
        {archivos.length === 0 ? (
          <p style={{ textAlign: "center", color: "#666", padding: "40px 20px" }}>
            Aún no hay archivos
          </p>
        ) : (
          archivos.map((archivo, index) => (
            <div key={index} className="file-item">
              <div className="file-info">
                <div className="file-name">{archivo.name}</div>
                <div className="file-meta">
                  {(archivo.size / (1024 * 1024)).toFixed(2)} MB • 
                  {new Date(archivo.lastModified).toLocaleDateString("es-ES")}
                </div>
              </div>
              <div className="file-actions">
                <button onClick={() => onDescargar(archivo)}>Descargar</button>
                <button className="eliminar" onClick={() => onEliminarArchivo(index)}>Eliminar</button>
              </div>
            </div>
          ))
        )}
      </div>
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
  const [modoRegistro, setModoRegistro] = React.useState(false);
  const [mensajeInfo, setMensajeInfo] = React.useState("");
  const [archivos, setArchivos] = React.useState([]);
  
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
    const tokenGuardado = localStorage.getItem("token");
    const usernameGuardado = localStorage.getItem("username");
    if (tokenGuardado && usernameGuardado) {
      setUsuario({ nombre: usernameGuardado });
    }
  }, []);

  React.useEffect(() => {
    if (usuario) {
      cargarTareas();
    }
  }, [cargarTareas, usuario]);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      setErrorLogin("Por favor completa todos los campos");
      return;
    }
    try {
      const res = await fetch("/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
      });
      const datos = await res.json();

      if (!res.ok) {
        setErrorLogin(datos.error);
        return;
      }

      localStorage.setItem("token", datos.token);
      localStorage.setItem("username", datos.username);
      setUsuario({ nombre: datos.username });
      setErrorLogin("");
      setUsername("");
      setPassword("");
    } catch (err) {
      setErrorLogin("Error al conectar con el servidor");
    }
  };

  const handleRegistro = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      setErrorLogin("Por favor completa todos los campos");
      return;
    }
    try {
      const res = await fetch("/registro", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
      });
      const datos = await res.json();

      if (!res.ok) {
        setErrorLogin(datos.error);
        setMensajeInfo("");
        return;
      }

      setErrorLogin("");
      setMensajeInfo("Usuario registrado correctamente. Ahora inicia sesión");
      setModoRegistro(false);
      setUsername("");
      setPassword("");
    } catch (err) {
      setErrorLogin("Error al conectar con el servidor");
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    setUsuario(null);
    setTareas([]);
    setArchivos([]);
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
      console.log("prioridad:", prioridad);
      console.log("categoria:", categoria);
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
  
  const onSubirArchivos = (fileList) => {
    const nuevosArchivos = Array.from(fileList);
    setArchivos(prev => [...prev, ...nuevosArchivos]);
  };

  const onDescargar = (archivo) => {
    try {
      console.log("Descargando archivo:", archivo.name);
      const url = URL.createObjectURL(archivo);
      const a = document.createElement("a");
      a.href = url;
      a.download = archivo.name || "archivo";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error al descargar:", error);
      alert("No se pudo descargar el archivo");
    }
  };

  const onEliminarArchivo = (index) => {
    setArchivos(prev => prev.filter((_, i) => i !== index));
  };


  if (!usuario) {
    return (
      <main className="contenedor login-page">
        <div className="login-container">
          <h2>{modoRegistro ? "Crear Cuenta" : "Iniciar Sesión"}</h2>
          
          <form onSubmit={modoRegistro ? handleRegistro : handleLogin}>
              <div className="input-group">
                <label>Usuario:</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Ingresa tu usuario"
                  autoComplete="off"
                />
              </div>
              <div className="input-group">
                <label>Contraseña:</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Ingresa tu contraseña"
                  autoComplete="off"
                />
              </div>
              {errorLogin && <p className="error-login">{errorLogin}</p>}
              <button type="submit" className="btn-login">
                {modoRegistro ? "Registrarse" : "Entrar"}
              </button>
            </form>

          <p className="cambiar-modo">
            {modoRegistro ? "¿Ya tienes cuenta?" : "¿No tienes cuenta?"}{" "}
            <span
              onClick={() => {
                setModoRegistro(!modoRegistro);
                setErrorLogin("");
                setMensajeInfo("");
              }}
            >{modoRegistro ? "Inicia sesión" : "Regístrate"}
            </span>
          </p>

          {mensajeInfo && <p className="mensaje-info">{mensajeInfo}</p>}
        </div>
      </main>
    );
  }

  return (
    <main className="contenedor">
      <div className="usuario-top">
        <span className="nombre-usuario">👤 {usuario.nombre}</span>
      </div>
    <h1>To-Do List</h1>
      <form className="formulario" onSubmit={agregarTarea}>
        <input
          type="text"
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          placeholder="Escribe una tarea"
        />
        <div className="formulario-fila">
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
        </div>
        <button type="submit" className="btn-agregar">Agregar</button>
      </form>
      <TaskList
        tareas={tareas}
        onCompletar={completarTarea}
        onFallar={fallarTarea}
        onEliminar={eliminarTarea}
      />
      <DriveSection
        archivos={archivos}
        onSubirArchivos={onSubirArchivos}
        onDescargar={onDescargar}
        onEliminarArchivo={onEliminarArchivo}
       />
      <div className="header-user">
        <button onClick={logout} className="btn-logout">Cerrar Sesión</button>
      </div>
    </main>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);