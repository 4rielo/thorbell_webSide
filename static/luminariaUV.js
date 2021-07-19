window.onload = getStatus;

document.getElementById("goBack").addEventListener("click", goBack);
document.getElementById("upBtn").addEventListener("click", increaseUVtimer);
document.getElementById("downBtn").addEventListener("click", decreaseUVtimer);
document.getElementById("uvBtn").addEventListener("click",toggleUV);
document.getElementById("uvTimerBtn").addEventListener("click",toggleTIMER_UV);

function getStatus() {
  let request = new XMLHttpRequest();
  request.open("GET", "/luminariaUV?status=refresh", true);       // Instantiating the request object
    request.onreadystatechange = function() {               // Defining event listener for readystatechange event
      if(this.readyState === 4 && this.status === 200) {    // Check if the request is compete and was successful

      };
  };
  request.send(); // Sending the request to the server
}

function goBack() {
  location.href = "./home";
}

function increaseUVtimer() {
  let request = new XMLHttpRequest();
  // Instantiating the request object
  request.open("GET", "/luminariaUV?status=increaseUVtimer", true);
  // Defining event listener for readystatechange event
  request.onreadystatechange = function() {
      // Check if the request is compete and was successful
      if(this.readyState === 4 && this.status === 200) {
        let status = JSON.parse(Text= this.responseText)
        document.getElementById('UVTimer').innerHTML = status['UV_Timer']
      };
  };
  // Sending the request to the server
  request.send();
}

function decreaseUVtimer() {
  let request = new XMLHttpRequest();
  // Instantiating the request object
  request.open("GET", "/luminariaUV?status=decreaseUVtimer", true);
  // Defining event listener for readystatechange event
  request.onreadystatechange = function() {
      // Check if the request is compete and was successful
      if(this.readyState === 4 && this.status === 200) {
        let status = JSON.parse(Text= this.responseText)
        document.getElementById('UVTimer').innerHTML = status['UV_Timer']
      };
  };
  // Sending the request to the server
  request.send();
}

function toggleUV() {
    // Creating the XMLHttpRequest object
    let request = new XMLHttpRequest();
    // Instantiating the request object
    request.open("GET", "/luminariaUV?status=toggleUV", true);
    // Defining event listener for readystatechange event
    request.onreadystatechange = function() {
        // Check if the request is compete and was successful
        if(this.readyState === 4 && this.status === 200) {
            // Inserting the response from server into an HTML element
            var display = JSON.parse(Text= this.responseText);
            if(display.UV_Light) {
              document.getElementById("UV_LightBtn").innerHTML = '<img id="uvBtn" class="absolute" src="./static/icons/uv_on.png" alt="UV_Light">'
            }
            else {
              document.getElementById("UV_LightBtn").innerHTML = '<img id="uvBtn" class="absolute" src="./static/icons/uv_off.png" alt="UV_Light">'
            }
            document.getElementById("uvBtn").addEventListener("click",toggleUV);
        }
    };
    // Sending the request to the server
    request.send();
}

function toggleTIMER_UV() {
    let request = new XMLHttpRequest();       // Creating the XMLHttpRequest object
    request.open("GET", "/luminariaUV?status=enableTimer", true);     // Instantiating the request object
    request.onreadystatechange = function() {               // Defining event listener for readystatechange event
        if(this.readyState === 4 && this.status === 200) {    // Check if the request is compete and was successful
            var display = JSON.parse(Text= this.responseText);
            if(display.UV_TimerEnable) {                      // Inserting the response from server into an HTML element
              document.getElementById("UV_timerBtn").innerHTML = '<img id="uvTimerBtn" class="absolute" src="./static/icons/timer_on.png" alt="uvTimer_Light">'
            }
            else {
              document.getElementById("UV_timerBtn").innerHTML = '<img id="uvTimerBtn" class="absolute" src="./static/icons/timer_off.png" alt="uvTimer_Light">'
            }
            document.getElementById("uvTimerBtn").addEventListener("click",toggleTIMER_UV);
        }
    };
    // Sending the request to the server
    request.send();
}
