let tareas = JSON.parse(localStorage.getItem("tareas")) || [];

function guardarTareas(){

  localStorage.setItem(
    "tareas",
    JSON.stringify(tareas)
  );

}

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

  guardarTareas();
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

  guardarTareas();
  mostrarTareas();
}

function completarTarea(indice){

  tareas[indice].estado = "completado";
  guardarTareas();
  mostrarTareas();
}

function fallarTarea(indice){

  tareas[indice].estado = "no-completado";

  guardarTareas();
  mostrarTareas();
}

mostrarTareas();

fetch("/tareas")
  .then(function(res){
    return res.json();
  })

  .then(function(datos){

    tareas = datos;

    mostrarTareas();

  });