// Recoger los parámetros de dificultad del juego y quien empieza
let params = new URLSearchParams(document.location.search);
let dificultad = params.get("dificultad");
let empieza = params.get("empieza");
let facil;
if (dificultad == "facil") {
  facil = true;
} else {
  facil = false;
}
let turnojugador;
if (empieza == "jugador") {
  turnojugador = true;
} else {
  turnojugador = false;
}

// Inicializamos la matriz de elementos en las filas y pintamos la situación inicial de la partida
let filascuantos = [3, 5, 7];
pintar();
pintarturno();
setInterval(cambiaColor, 700);

// Función para adecuar los mensajes y los botones en funcion de quien sea el turno
function pintarturno() {
  if (turnojugador) {
    turnoquien = "Turno: JUGADOR";
    turnomensaje = "Teclea la fila y el numero de elementos a eliminar y pulsa en el boton Jugar"
    document.getElementById("fila").value = "";
    document.getElementById("cuantos").value = "";
    document.getElementById('jugar').disabled = false;
    document.getElementById('jugarCPU').disabled = true;
  } else {
    turnoquien = "Turno: CPU - Nivel de juego: " + dificultad;
    turnomensaje = "Pulsa en el boton Jugar CPU"
    document.getElementById('jugar').disabled = true;
    document.getElementById('jugarCPU').disabled = false;

  }
  document.getElementById('turno').innerHTML = turnoquien;
  document.getElementById('mensajeturno').innerHTML = turnomensaje;
}

// Cambia el color del fondo a cajaturno para resaltar el turno y las instrucciones
let cambiar = 0;
function cambiaColor() {
  let color = document.getElementById("cajaturno");
  let colorActual = color.style.backgroundColor;
  if (cambiar == 0) {
    nuevoColor = "#000066";
    cambiar = 1;
  } else {
    nuevoColor = "#003300";
    cambiar = 0;
  }
  color.style.backgroundColor = nuevoColor;
}

// Funciones para pintar la matriz de elementos en las filas
function pintar() {
  let pintar = " "
  for (let i = 0; i < 3; i++) {
    pintar = pintarfila(i);
    enviarfila(i, pintar);
  }
}
function pintarfila(fila) {
  let pintar = "(" + filascuantos[fila] + ")   ";
  for (let i = 0; i < filascuantos[fila]; i++) {
    pintar = pintar + "* ";
  }
  return pintar;
}
function enviarfila(fila, contenido) {
  if (fila == 0) {
    document.getElementById('fila1').innerHTML = contenido;
  } else if (fila == 1) {
    document.getElementById('fila2').innerHTML = contenido;
  } else if (fila == 2) {
    document.getElementById('fila3').innerHTML = contenido;
  }
}

// Funciones para pintar la situación anterior a la jugada de la matriz de elementos en las filas
function pintaranterior() {
  let pintar = " "
  for (let i = 0; i < 3; i++) {
    pintar = pintarfila(i);
    enviarfilaanterior(i, pintar);
  }
}
function enviarfilaanterior(fila, contenido) {
  if (fila == 0) {
    document.getElementById('fila1anterior').innerHTML = contenido;
  } else if (fila == 1) {
    document.getElementById('fila2anterior').innerHTML = contenido;
  } else if (fila == 2) {
    document.getElementById('fila3anterior').innerHTML = contenido;
  }
}

// Función principal para resolver una jugada
function jugada() {
  pintaranterior();
  if (turnojugador) {
    if (comprobarganador()) {
      document.getElementById('turno').innerHTML = "LO SIENTO,";
      document.getElementById('mensajeturno').innerHTML = "HAS PERDIDO";
    } else {
      jugadajugador();
    }
  } else { // Turno CPU
    if (comprobarganador()) {
      document.getElementById('turno').innerHTML = "ENHORABUENA,";
      document.getElementById('mensajeturno').innerHTML = "HAS GANADO";
    } else {
      document.getElementById('turno').innerHTML = "Espere mientras se procesa la jugada";
      document.getElementById('mensajeturno').innerHTML = "........................";
      setTimeout(jugadaCPU, 2000);
    }
  }
}

// Función para comprobar si se ha ganado (pierde el que coje el último elemento de la matriz de filas)
function comprobarganador() {
  let total = 0;
  for (let i = 0; i < 3; i++){
    total += filascuantos[i];
    }
    if (total == 1) {
      return true;
    } else {
      return false;
  }
}

// Declaramos las variables donde se van a guardar el numero de fila y la cantidad de elementos que se quitan de ella
let numerofila = 0;
let cuantosquito = 0;

// Función para la jugada cuando el turno es del jugador
function jugadajugador() {
  numerofila = document.getElementById('fila').value;
  cuantosquito = document.getElementById('cuantos').value;
  // Validar si es un número entero
  if (!Number.isInteger(parseFloat(numerofila)) || !Number.isInteger(parseFloat(cuantosquito))) {
    alert("'Debes rellenar correctamente la fila y el numero de elementos a quitar: Ambos deben ser números enteros.");
    return;
  }
  if (numerofila >= 1 && numerofila <= 3) {
    if (cuantosquito >= 1 && cuantosquito <= filascuantos[numerofila-1]) {
      document.getElementById('jugada').innerHTML = "Jugada: Has quitado " + cuantosquito + " de la fila: " + numerofila;
      filascuantos[numerofila-1] -= cuantosquito;
      pintar();
      turnojugador = false;
      pintarturno();
    } else {
      alert('Debes rellenar correctamente la fila y el numero de elementos a quitar: El numero de elementos debe estar comprendido entre 1 y el numero total de elementos de la fila elegida');
    }
  } else {
    alert('Debes rellenar correctamente la fila y el numero de elementos a quitar: La fila debe estar comprendida entre 1 y 3');
  }
}

// Función para la jugada cuando el turno es de la CPU
function jugadaCPU() {
  if (facil) {
    jugadaCPUaleatoria();
  } else {
    jugadaCPUcalculada();
    if (numerofila == 0) {
      jugadaCPUaleatoria();
    }
  }
  document.getElementById('jugada').innerHTML = "Jugada: CPU quita " + cuantosquito + " de la fila: " + numerofila;
  filascuantos[numerofila-1] -= cuantosquito;
  pintar();
  turnojugador = true;
  pintarturno();
}
// Jugada CPU nivel fácil: se resuelve de forma aleatoria
function jugadaCPUaleatoria() {
  let seguir = true;
  while (seguir) {
    numerofila = Math.floor(Math.random()*3)+1;
    if (filascuantos[numerofila-1] > 0) {
      cuantosquito = Math.floor(Math.random()*(filascuantos[numerofila-1])+1);
      seguir = false;
    }
  }
}
// Jugada CPU nivel difíci: se resuelve aplicando reglas en función de la situación y teniendo en cuenta
// cuales son las jugadas ganadoras: 001 0XX(X>1) 111 123 145 246 257 347 356
function jugadaCPUcalculada() {
  // Ponemos a 0 las variables para que se devuelvan así si no se encuentra una jugada ganadora
  numerofila = 0;
  cuantosquito = 0;
  // Nos apoyamos en una matriz auxiliar de 3x2 donde guardaremos el numero de elementos de las filas en la primera
  // dimensión, y la fila a la que pertenece en la segunda, para después ordenarla por el número de elementos de
  // las filas y que nos resulte más sencillo la búsqueda de jugadas ganadoras
  let matrizaux = [
    [1, 1],
    [1, 1],
    [1, 1]
  ];
  for (let i = 0; i < filascuantos.length; i++) {
    matrizaux[i][0] = filascuantos[i];
    matrizaux[i][1] = i+1;
  }
  matrizaux.sort(function(a, b) {
    return a[0] - b[0];
  });
  // PARA EL CASO EN EL QUE HAY ALGUNA FILA VACIA
  if (matrizaux[0][0] == 0) {// hay alguna fila vacia (0 X Y)
    if (matrizaux[1][0] == 0) { // hay 2 filas vacias (0 0 X)
      if (matrizaux[2][0] > 1) { // si la ultima fila tiene mas de 1 elemento (0 0 X>1)
        numerofila = matrizaux[2][1]; // asignamos la ultima fila
        cuantosquito = filascuantos[numerofila-1] - 1; // quitamos todos los elementos menos 1 (X-1) (001)
      }
    } else { // hay 1 fila vacia, solo 2 filas tienen elementos (0 X Y)
      if (matrizaux[1][0] == 1) { // de las 2, alguna solo tiene 1 elemento (0 1 X)
        numerofila = matrizaux[2][1]; // asignamos la ultima fila, que tiene 1 o más elementos
        cuantosquito = filascuantos[numerofila-1]; // quitamos todos los elementos (X) (001)
      } else { // las 2 filas tienen mas de 1 elemento  (0 X Y)
        if (matrizaux[1][0] < matrizaux[2][0]) { // no tienen el mismo numero de elementos (0 X>1 Y>X )
          numerofila = matrizaux[2][1]; // la que tiene mas elementos es la ultima fila
          cuantosquito = matrizaux[2][0] - matrizaux[1][0]; // quitamos la diferencia de elementos asi se quedan iguales (Y-X) (0 X X)
        }
      }
    }
  // PARA EL CASO EN EL QUE TODAS LAS FILAS TIENEN ELEMENTOS
  } else { // ninguna fila esta vacia, las 3 filas tienen elementos
    if (matrizaux[0][0] == matrizaux[1][0] && matrizaux[0][0] > 1) { // si las 2 primeras filas tienen el mismo numero de elementos (X X Y)
      numerofila = matrizaux[2][1]; // asignamos la otra fila
      cuantosquito = filascuantos[numerofila-1]; // quitamos todos los elementos (Y) (0 X X)
      return;
    }
    if (matrizaux[0][0] == matrizaux[2][0] && matrizaux[0][0] > 1) { // la primera y la ultima fila tienen el mismo numero de elementos (X Y X)
      numerofila = matrizaux[1][1]; // asignamos la otra fila
      cuantosquito = filascuantos[numerofila-1]; // quitamos todos los elementos (Y) (0 X X)
      return;
    }
    if (matrizaux[1][0] == matrizaux[2][0] && matrizaux[1][0] > 1) { // las 2 ultimas filas tienen el mismo numero de elementos (Y X X)
      numerofila = matrizaux[0][1]; // asignamos la otra fila
      cuantosquito = filascuantos[numerofila-1]; // quitamos todos los elementos (Y) (0 X X)
      return;
    }
    if (matrizaux[0][0] == 1) {// de las 3, alguna solo tiene 1 elemento (1 X X)
      if (matrizaux[1][0] == 1) { // hay 2 que tienen solo 1 elemento  (1 1 X)
        if (matrizaux[2][0] > 1) { // si la ultima fila tiene mas de 1 elemento (1 1 X>1)
          numerofila = matrizaux[2][1]; // asignamos la ultima fila
          cuantosquito = filascuantos[numerofila-1] - 1; // quitamos todos los elementos menos 1 (X-1) 111
          return;
        }
      }
      if (matrizaux[1][0] == 2) { // hay una fila con 1 elemento y otra con 2 elementos (1 2 X)
        if (matrizaux[2][0] > 3) { // si la ultima fila tiene mas de 3 elementos (1 2 X>3)
          numerofila = matrizaux[2][1]; // asignamos la ultima fila
          cuantosquito = filascuantos[numerofila-1] - 3; // quitamos todos los elementos menos 3 (X-3) 123
          return;
        }
      }
      if (matrizaux[1][0] == 3) { // hay una fila con 1 elemento y otra con 3 elementos (1 3 X)
        if (matrizaux[2][0] > 2) { // si la ultima fila tiene mas de 2 elementos (1 3 X>2)
          numerofila = matrizaux[2][1]; // asignamos la ultima fila
          cuantosquito = filascuantos[numerofila-1] - 2; // quitamos todos los elementos menos 2 (X-2) 123
          return;
        }
      }
      if (matrizaux[1][0] == 4) { // hay una fila con 1 elemento y otra con 4 elementos (1 4 X)
        if (matrizaux[2][0] > 5) { // si la ultima fila tiene mas de 5 elementos (1 4 X>5)
          numerofila = matrizaux[2][1]; // asignamos la ultima fila
          cuantosquito = filascuantos[numerofila-1] - 5; // quitamos todos los elementos menos 5 (X-5) 145
          return;
        }
      }
      if (matrizaux[1][0] == 5) { // hay una fila con 1 elemento y otra con 5 elementos (1 5 X)
        if (matrizaux[2][0] > 4) { // si la ultima fila tiene mas de 4 elementos (1 5 X>4)
          numerofila = matrizaux[2][1]; // asignamos la ultima fila
          cuantosquito = filascuantos[numerofila-1] - 4; // quitamos todos los elementos menos 4 (X-4) 145
          return;
        }
      }
    }
    if (matrizaux[0][0] == 2) {// de las 3, la que menos tiene 2 elementos (2 X X)
      if (matrizaux[1][0] == 3) { // hay una fila con 2 elemento y otra con 3 elementos (2 3 X)
        if (matrizaux[2][0] > 1) { // si la ultima fila tiene mas de 1 elementos (2 3 X>1)
          numerofila = matrizaux[2][1]; // asignamos la ultima fila
          cuantosquito = filascuantos[numerofila-1] - 1; // quitamos todos los elementos menos 1 (X-1) 123
          return;
        }
      }
      if (matrizaux[1][0] == 4) { // hay una fila con 2 elemento y otra con 4 elementos (2 4 X)
        if (matrizaux[2][0] == 5) { // si la ultima fila tiene mas de 5 elementos (2 4 5)
          numerofila = matrizaux[0][1]; // asignamos la primera fila
          cuantosquito = filascuantos[numerofila-1] - 1; // quitamos todos los elementos menos 1 (X-1) 145
          return;
        }
        if (matrizaux[2][0] > 6) { // si la ultima fila tiene mas de 6 elementos (2 4 X>6)
          numerofila = matrizaux[2][1]; // asignamos la ultima fila
          cuantosquito = filascuantos[numerofila-1] - 6; // quitamos todos los elementos menos 6 (X-6) 246
          return;
        }
      }
      if (matrizaux[1][0] == 5) { // hay una fila con 2 elemento y otra con 5 elementos (2 5 X)
        if (matrizaux[2][0] == 6) { // si la ultima fila tiene mas de 5 elementos (2 5 6)
          numerofila = matrizaux[1][1]; // asignamos la fila del medio
          cuantosquito = filascuantos[numerofila-1] - 4; // quitamos todos los elementos menos 4 (X-4) 246
          return;
        }
      }
    }
    if (matrizaux[0][0] == 3) {// de las 3, la que menos tiene 3 elementos (3 X X)
      if (matrizaux[1][0] == 4) { // hay una fila con 3 elemento y otra con 4 elementos (3 4 X)
        if (matrizaux[2][0] == 5) { // si la ultima fila tiene mas de 5 elementos (3 4 5)
          numerofila = matrizaux[0][1]; // asignamos la primera fila
          cuantosquito = filascuantos[numerofila-1] - 1; // quitamos todos los elementos menos 1 (X-1) 145
          return;
        }
        if (matrizaux[2][0] == 6) { // si la ultima fila tiene mas de 5 elementos (3 4 6)
          numerofila = matrizaux[0][1]; // asignamos la primera fila
          cuantosquito = filascuantos[numerofila-1] - 2; // quitamos todos los elementos menos 2 (X-2) 246
          return;
        }
      }
      if (matrizaux[1][0] == 5) { // hay una fila con 3 elemento y otra con 5 elementos (3 5 X)
        if (matrizaux[2][0] == 7) { // si la ultima fila tiene mas de 5 elementos (3 5 7)
          numerofila = Math.floor(Math.random()*3)+1; // asignamos una fila aleatoria
          cuantosquito = 1; // quitamos todos los elementos menos 1 (X-1) 257 347 356
          return;
        }
      }
    }
  }
}
