function TaskItem({ tarea, indice, onCompletar, onFallar, onEliminar }) {
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
        <button onClick={() => onCompletar(indice)}>✓</button>

        <button onClick={() => onFallar(indice)}>✕</button>

        <button
          className="eliminar"
          onClick={() => onEliminar(indice)}
        >
          X
        </button>
      </div>
    </div>
  );
}

function TaskList({
  tareas,
  onCompletar,
  onFallar,
  onEliminar
}) {
  return (
    <section id="listaTareas">
      {tareas.map((tarea, i) => (
        <TaskItem
          key={i}
          tarea={tarea}
          indice={i}
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

  React.useEffect(() => {
    fetch("/tareas")
      .then(res => res.json())
      .then(datos => setTareas(datos))
      .catch(err => console.error(err));
  }, []);

  const agregarTarea = (e) => {
    e.preventDefault();

    if (!texto.trim()) {
      alert("Escribe una tarea");
      return;
    }

    fetch("/tareas", {
      method: "POST",

      headers: {
        "Content-Type": "application/json"
      },

      body: JSON.stringify({
        texto,
        estado: "pendiente"
      })
    })

      .then(res => res.json())

      .then(() => {
        setTexto("");

        return fetch("/tareas")
          .then(res => res.json())
          .then(datos => setTareas(datos));
      })

      .catch(err => console.error(err));
  };

  const completarTarea = (indice) => {
    fetch("/tareas/" + indice, {
      method: "PUT",

      headers: {
        "Content-Type": "application/json"
      },

      body: JSON.stringify({
        estado: "completado"
      })
    })

      .then(() =>
        fetch("/tareas")
          .then(res => res.json())
          .then(datos => setTareas(datos))
      )

      .catch(err => console.error(err));
  };

  const fallarTarea = (indice) => {
    fetch("/tareas/" + indice, {
      method: "PUT",

      headers: {
        "Content-Type": "application/json"
      },

      body: JSON.stringify({
        estado: "no-completado"
      })
    })

      .then(() =>
        fetch("/tareas")
          .then(res => res.json())
          .then(datos => setTareas(datos))
      )

      .catch(err => console.error(err));
  };

  const eliminarTarea = (indice) => {
    fetch("/tareas/" + indice, {
      method: "DELETE"
    })

      .then(() =>
        fetch("/tareas")
          .then(res => res.json())
          .then(datos => setTareas(datos))
      )

      .catch(err => console.error(err));
  };

  return (
    <main className="contenedor">
      <h1>To-Do List</h1>

      <form
        className="formulario"
        onSubmit={agregarTarea}
      >
        <input
          type="text"
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          placeholder="Escribe una tarea"
        />

        <button type="submit">
          Agregar
        </button>
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

const root = ReactDOM.createRoot(
  document.getElementById("root")
);

root.render(<App />);function TaskItem({ tarea, indice, onCompletar, onFallar, onEliminar }) {
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
        <button onClick={() => onCompletar(indice)}>✓</button>

        <button onClick={() => onFallar(indice)}>✕</button>

        <button
          className="eliminar"
          onClick={() => onEliminar(indice)}
        >
          X
        </button>
      </div>
    </div>
  );
}

function TaskList({
  tareas,
  onCompletar,
  onFallar,
  onEliminar
}) {
  return (
    <section id="listaTareas">
      {tareas.map((tarea, i) => (
        <TaskItem
          key={i}
          tarea={tarea}
          indice={i}
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

  React.useEffect(() => {
    fetch("/tareas")
      .then(res => res.json())
      .then(datos => setTareas(datos))
      .catch(err => console.error(err));
  }, []);

  const agregarTarea = (e) => {
    e.preventDefault();

    if (!texto.trim()) {
      alert("Escribe una tarea");
      return;
    }

    fetch("/tareas", {
      method: "POST",

      headers: {
        "Content-Type": "application/json"
      },

      body: JSON.stringify({
        texto,
        estado: "pendiente"
      })
    })

      .then(res => res.json())

      .then(() => {
        setTexto("");

        return fetch("/tareas")
          .then(res => res.json())
          .then(datos => setTareas(datos));
      })

      .catch(err => console.error(err));
  };

  const completarTarea = (indice) => {
    fetch("/tareas/" + indice, {
      method: "PUT",

      headers: {
        "Content-Type": "application/json"
      },

      body: JSON.stringify({
        estado: "completado"
      })
    })

      .then(() =>
        fetch("/tareas")
          .then(res => res.json())
          .then(datos => setTareas(datos))
      )

      .catch(err => console.error(err));
  };

  const fallarTarea = (indice) => {
    fetch("/tareas/" + indice, {
      method: "PUT",

      headers: {
        "Content-Type": "application/json"
      },

      body: JSON.stringify({
        estado: "no-completado"
      })
    })

      .then(() =>
        fetch("/tareas")
          .then(res => res.json())
          .then(datos => setTareas(datos))
      )

      .catch(err => console.error(err));
  };

  const eliminarTarea = (indice) => {
    fetch("/tareas/" + indice, {
      method: "DELETE"
    })

      .then(() =>
        fetch("/tareas")
          .then(res => res.json())
          .then(datos => setTareas(datos))
      )

      .catch(err => console.error(err));
  };

  return (
    <main className="contenedor">
      <h1>To-Do List</h1>

      <form
        className="formulario"
        onSubmit={agregarTarea}
      >
        <input
          type="text"
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          placeholder="Escribe una tarea"
        />

        <button type="submit">
          Agregar
        </button>
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

const root = ReactDOM.createRoot(
  document.getElementById("root")
);

root.render(<App />);
