let tareas = [];

function agregarTarea(){

  const input = document.getElementById("inputTarea");

  const texto = input.value;

  if(texto === ""){
    alert("Escribe una tarea");
    return;
  }

  tareas.push({
  texto: texto,
  estado: "pendiente"
});

  mostrarTareas();

  input.value = "";
}

function mostrarTareas(){

  const lista = document.getElementById("listaTareas");

  lista.innerHTML = "";

  for(let i = 0; i < tareas.length; i++){

  let color = "";

  if(tareas[i].estado === "completado"){
    color = "verde";
  }

  else if(tareas[i].estado === "no-completado"){
    color = "rojo";
  }

  lista.innerHTML += `
    <div class="tarea ${color}">

      <span>${tareas[i].texto}</span>

      <div>

        <button onclick="completarTarea(${i})">
          ✓
        </button>

        <button onclick="fallarTarea(${i})">
          ✕
        </button>

        <button
          class="eliminar"
          onclick="eliminarTarea(${i})"
        >
          X
        </button>

      </div>

    </div>
  `;
}
}

function eliminarTarea(indice){

  tareas.splice(indice,1);

  mostrarTareas();
}

function completarTarea(indice){

  tareas[indice].estado = "completado";

  mostrarTareas();
}

function fallarTarea(indice){

  tareas[indice].estado = "no-completado";

  mostrarTareas();
}