let tareas = JSON.parse(localStorage.getItem("tareas")) || [];

function cargarTareas(){

  fetch("/tareas")

    .then(function(res){
      return res.json();
    })

    .then(function(datos){

      tareas = datos;

      mostrarTareas();

    });

}

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

  fetch("/tareas", {

  method: "POST",

  headers: {
    "Content-Type": "application/json"
  },

  body: JSON.stringify({
    texto: texto,
    estado: "pendiente"
  })

})

.then(function(res){
  return res.json();
})

.then(function(datos){

  console.log(datos);

  input.value = "";

  cargarTareas();

});
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

  fetch("/tareas/" + indice, {

    method: "DELETE"

  })

  .then(function(res){
    return res.json();
  })

  .then(function(datos){

    console.log(datos);

    cargarTareas();

  });

}

function completarTarea(indice){

  fetch("/tareas/" + indice, {

    method: "PUT",

    headers: {
      "Content-Type": "application/json"
    },

    body: JSON.stringify({
      estado: "completado"
    })

  })

  .then(function(res){
    return res.json();
  })

  .then(function(datos){

    console.log(datos);

    cargarTareas();

  });

}

function fallarTarea(indice){

  fetch("/tareas/" + indice, {

    method: "PUT",

    headers: {
      "Content-Type": "application/json"
    },

    body: JSON.stringify({
      estado: "no-completado"
    })

  })

  .then(function(res){
    return res.json();
  })

  .then(function(datos){

    console.log(datos);

    cargarTareas();

  });

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