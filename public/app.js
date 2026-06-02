function TaskItem({ tarea, onCompletar, onFallar, onEliminar }) {
  const clase =
    tarea.estado === "completado"
      ? "verde"
      : tarea.estado === "no-completado"
      ? "rojo"
      : "";

  return (
    <div className={`tarea ${clase}`}>
      <span>{tarea.texto}</span>
      <div>
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
  const [tareas, setTareas] = React.useState([]);

  const cargarTareas = () => {
    fetch("/tareas")
      .then(res => res.json())
      .then(datos => setTareas(datos))
      .catch(err => console.error(err));
  };

  React.useEffect(() => {
    cargarTareas();
  }, []);

  const agregarTarea = (e) => {
    e.preventDefault();
    if (!texto.trim()) {
      alert("Escribe una tarea");
      return;
    }
    fetch("/tareas", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ texto, estado: "pendiente" })
    })
    .then(() => {
      setTexto("");
      cargarTareas();
    })
    .catch(err => console.error(err));
  };

  const completarTarea = (id) => {
    fetch("/tareas/" + id, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ estado: "completado" })
    })
    .then(() => cargarTareas())
    .catch(err => console.error(err));
  };

  const fallarTarea = (id) => {
    fetch("/tareas/" + id, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ estado: "no-completado" })
    })
    .then(() => cargarTareas())
    .catch(err => console.error(err));
  };

  const eliminarTarea = (id) => {
    fetch("/tareas/" + id, { method: "DELETE" })
    .then(() => cargarTareas())
    .catch(err => console.error(err));
  };

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