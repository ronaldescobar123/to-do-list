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

 const cargarTareas = async () => {         
    try {                                   
      const res = await fetch("/tareas");     
      const datos = await res.json();          
      setTareas(datos);
    } catch (err) {
      console.error("Error al cargar tareas:", err);
    }
  };

  React.useEffect(() => {
    cargarTareas();
  }, []);

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
        body: JSON.stringify({ texto, estado: "pendiente" })
      });
      
      setTexto("");
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
      console.error("Error al completar tarea:", err);
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
      console.error("Error al marcar como no completada:", err);
    }
  };

  const eliminarTarea = async (id) => {        
    try {                                    
      await fetch("/tareas/" + id, {          
        method: "DELETE"
      });
      cargarTareas();
    } catch (err) {
      console.error("Error al eliminar tarea:", err);
    }
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
