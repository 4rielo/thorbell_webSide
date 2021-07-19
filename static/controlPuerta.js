document.getElementById("goBack").addEventListener("click", goBack);
document.getElementById("upBtn").addEventListener("click", subirPuerta);
document.getElementById("downBtn").addEventListener("click", bajarPuerta);
document.getElementById("abrirBtn").addEventListener("click", abrirPuerta);
document.getElementById("trabajoBtn").addEventListener("click", trabajoPuerta);
document.getElementById("cerrarBtn").addEventListener("click", cerrarPuerta);

function goBack() {
  location.href = "./home";
}

function subirPuerta() {
  let request = new XMLHttpRequest();
  // Instantiating the request object
  request.open("GET", "/controlPuerta?status=subirPuerta", true);
  // Defining event listener for readystatechange event
  request.onreadystatechange = function() {
      // Check if the request is compete and was successful
      if(this.readyState === 4 && this.status === 200) {

      };
  };
  // Sending the request to the server
  request.send();
}

function bajarPuerta() {
  let request = new XMLHttpRequest();
  // Instantiating the request object
  request.open("GET", "/controlPuerta?status=bajarPuerta", true);
  // Defining event listener for readystatechange event
  request.onreadystatechange = function() {
      // Check if the request is compete and was successful
      if(this.readyState === 4 && this.status === 200) {

      };
  };
  // Sending the request to the server
  request.send();
}

function abrirPuerta() {
  let request = new XMLHttpRequest();
  // Instantiating the request object
  request.open("GET", "/controlPuerta?status=abrirPuerta", true);
  // Defining event listener for readystatechange event
  request.onreadystatechange = function() {
      // Check if the request is compete and was successful
      if(this.readyState === 4 && this.status === 200) {

      };
  };
  // Sending the request to the server
  request.send();
}

function trabajoPuerta() {
  let request = new XMLHttpRequest();
  // Instantiating the request object
  request.open("GET", "/controlPuerta?status=trabajoPuerta", true);
  // Defining event listener for readystatechange event
  request.onreadystatechange = function() {
      // Check if the request is compete and was successful
      if(this.readyState === 4 && this.status === 200) {

      };
  };
  // Sending the request to the server
  request.send();
}

function cerrarPuerta() {
  let request = new XMLHttpRequest();
  // Instantiating the request object
  request.open("GET", "/controlPuerta?status=cerrarPuerta", true);
  // Defining event listener for readystatechange event
  request.onreadystatechange = function() {
      // Check if the request is compete and was successful
      if(this.readyState === 4 && this.status === 200) {

      };
  };
  // Sending the request to the server
  request.send();
}
