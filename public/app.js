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
function RegisterForm({ setModoRegistro, setMensajeInfo, setErrorLogin }) {
  const [formData, setFormData] = React.useState({
    nombre: "",
    apellido: "",
    username: "",
    email: "",
    numero: "",
    password: "",
    confirmPassword: ""
  });

  const [errores, setErrores] = React.useState({});
  const [cargando, setCargando] = React.useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errores[name]) {
      setErrores(prev => ({ ...prev, [name]: "" }));
    }
  };

  const validarFormulario = () => {
    const nuevosErrores = {};

    if (!formData.nombre.trim()) nuevosErrores.nombre = "Nombre requerido";
    if (!formData.apellido.trim()) nuevosErrores.apellido = "Apellido requerido";
    if (!formData.username.trim()) nuevosErrores.username = "Usuario requerido";
    if (!formData.email.trim()) nuevosErrores.email = "Email requerido";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) nuevosErrores.email = "Email inválido";

    if (!formData.numero.trim()) nuevosErrores.numero = "Número requerido";
    else if (!/^\d{8,15}$/.test(formData.numero.replace(/\D/g, ''))) 
      nuevosErrores.numero = "Número inválido";

    if (!formData.password) nuevosErrores.password = "Contraseña requerida";
    else if (formData.password.length < 6) nuevosErrores.password = "Mínimo 6 caracteres";

    if (formData.password !== formData.confirmPassword) 
      nuevosErrores.confirmPassword = "Las contraseñas no coinciden";

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validarFormulario()) return;

    setCargando(true);

    setTimeout(() => {
      setCargando(false);
      setMensajeInfo("Usuario registrado");
      setModoRegistro(false);

      setFormData({
        nombre: "", apellido: "", username: "", email: "", 
        numero: "", password: "", confirmPassword: ""
      });
      setErrores({});
    }, 800);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="input-group">
        <label>Nombre *</label>
        <input type="text" name="nombre" value={formData.nombre} onChange={handleChange} placeholder="Tu nombre" />
        {errores.nombre && <p className="error-field">{errores.nombre}</p>}
      </div>

      <div className="input-group">
        <label>Apellido *</label>
        <input type="text" name="apellido" value={formData.apellido} onChange={handleChange} placeholder="Tu apellido" />
        {errores.apellido && <p className="error-field">{errores.apellido}</p>}
      </div>

      <div className="input-group">
        <label>Usuario *</label>
        <input type="text" name="username" value={formData.username} onChange={handleChange} placeholder="Nombre de usuario" />
        {errores.username && <p className="error-field">{errores.username}</p>}
      </div>

      <div className="input-group">
        <label>Email *</label>
        <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="ejemplo@gmail.com" />
        {errores.email && <p className="error-field">{errores.email}</p>}
      </div>

      <div className="input-group">
        <label>Número de Teléfono *</label>
        <input type="tel" name="numero" value={formData.numero} onChange={handleChange} placeholder="123456789" />
        {errores.numero && <p className="error-field">{errores.numero}</p>}
      </div>

      <div className="input-group">
        <label>Contraseña *</label>
        <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Contraseña" />
        {errores.password && <p className="error-field">{errores.password}</p>}
      </div>

      <div className="input-group">
        <label>Confirmar Contraseña *</label>
        <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} placeholder="Repetir contraseña" />
        {errores.confirmPassword && <p className="error-field">{errores.confirmPassword}</p>}
      </div>

      <button type="submit" className="btn-login" disabled={cargando}>
        {cargando ? "Procesando..." : "Registrarse"}
      </button>
    </form>
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
          
          {modoRegistro ? (
            <RegisterForm 
              setModoRegistro={setModoRegistro}
              setMensajeInfo={setMensajeInfo}
              setErrorLogin={setErrorLogin}
            />
            ):(
            <form onSubmit={handleLogin}>
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
              <button type="submit" className="btn-login">Entrar</button>
            </form>
          )}

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