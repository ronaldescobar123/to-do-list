let tareas = [];

function agregarTarea(){

  const input = document.getElementById("inputTarea");

  const texto = input.value;

  if(texto === ""){
    alert("Escribe una tarea");
    return;
  }

  tareas.push(texto);

  mostrarTareas();

  input.value = "";
}

function mostrarTareas(){

  const lista = document.getElementById("listaTareas");

  lista.innerHTML = "";

  for(let i = 0; i < tareas.length; i++){

    lista.innerHTML += `
      <div class="tarea">

        <span>${tareas[i]}</span>

        <button
          class="eliminar"
          onclick="eliminarTarea(${i})"
        >
          X
        </button>

      </div>
    `;
  }
}

function eliminarTarea(indice){

  tareas.splice(indice,1);

  mostrarTareas();
}