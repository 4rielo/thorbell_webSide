window.onload = setupRefresh;

function setupRefresh() {
    setInterval("getStatus();", 1000);
    setInterval("getAirSpeed();", 1000);
    setInterval("getTime();", 1000);
    //document.getElementById("LED_Light").onmousedown="LED_LightMouseDown()";
}

var LED_pressTimer=null;
var UV_pressTimer=null;

function getStatus() {
    // Creating the XMLHttpRequest object
    let request = new XMLHttpRequest();

    // Instantiating the request object
    request.open("GET", "/home?status=refresh", true);

    // Defining event listener for readystatechange event
    request.onreadystatechange = function() {
        // Check if the request is compete and was successful
        if(this.readyState === 4 && this.status === 200) {
            // Inserting the response from server into an HTML element
            var status = JSON.parse(Text= this.responseText);
            if(status.LED_Light) {      //If LED_Light in status JSON is True
              document.getElementById("LED_LightBtn").innerHTML = '<img id="LightBtn" class="absolute" src="./static/icons/led_on.png" alt="LED_Light">'
            }
            else {
              document.getElementById("LED_LightBtn").innerHTML = '<img id="LightBtn" class="absolute" src="./static/icons/led_off.png" alt="LED_Light">'
            }


            if(status.UV_Light) {      //If LED_Light in status JSON is True
              document.getElementById("UV_LightBtn").innerHTML = '<img id="uvBtn" class="absolute" src="./static/icons/uv_on.png" alt="LED_Light">'
            }
            else {
              document.getElementById("UV_LightBtn").innerHTML = '<img id="uvBtn" class="absolute" src="./static/icons/uv_off.png" alt="LED_Light">'
            }

            //Displays overall status received
            //document.getElementById("Status").innerHTML = this.responseText;
            //document.getElementById("LED_Light").onmouseup = toggleLED;
            document.getElementById("LightBtn").addEventListener("mousedown",LED_LightMouseDown);
            document.getElementById("LightBtn").addEventListener("click",toggleLED);

            document.getElementById("uvBtn").addEventListener("mousedown",UV_LightMouseDown);
            document.getElementById("uvBtn").addEventListener("click",toggleUV);

        }
    };

    // Sending the request to the server
    request.send();
}

function getAirSpeed() {
    // Creating the XMLHttpRequest object
    let request = new XMLHttpRequest();

    // Instantiating the request object
    request.open("GET", "/home?status=adc", true);

    // Defining event listener for readystatechange event
    request.onreadystatechange = function() {
        // Check if the request is compete and was successful
        if(this.readyState === 4 && this.status === 200) {
            // Inserting the response from server into an HTML element
            //document.getElementById("windSpeed").innerHTML = this.responseText;

            //************************Presion y Flujo de Entrada
            presionEntrada = Number(JSON.parse(this.responseText).presionEntrada);
            flujoEntrada = Number(JSON.parse(this.responseText).flujoEntrada).toFixed(2);

            stopValue = presionEntrada / 4096.0;
            gradient = stopValue-0.05;
            if(gradient < 0) {
                gradient = 0;
                stopValue = 0.05;
            }
            if(stopValue>1) {
                stopValue=1;
            }
            if(gradient>1) {
                gradient=1;
            }
            if(stopValue < 0.15 || stopValue > 0.85 ) {
                colorEntrada= "rgba(255, 0, 0, 145)";
                colorEntradaFin = "rgba(255, 0, 0, 0)";
            }
            else if(stopValue < 0.4 || stopValue > 0.6) {
                colorEntrada="rgba(255, 197, 0, 145)";
                colorEntradaFin="rgba(255, 197, 0, 0)";
            }
            else {
                colorEntrada="rgba(51, 255, 151, 145)";
                colorEntradaFin="rgba(51, 255, 151, 0)";
            }
            presionEntrada = (300 * stopValue).toString() + 'px';
            positionEntrada = (150 * stopValue);

            //************************Presion y Flujo de Salida
            presionSalida = Number(JSON.parse(this.responseText).presionSalida);
            flujoSalida = Number(JSON.parse(this.responseText).flujoSalida).toFixed(2);

            stopValue = presionSalida / 4096.0;
            gradient = stopValue-0.05;
            if(gradient < 0) {
                gradient = 0;
                stopValue = 0.05;
            }
            if(stopValue>1) {
                stopValue=1;
            }
            if(gradient>1) {
                gradient=1;
            }
            if(stopValue < 0.15 || stopValue > 0.85 ) {
                colorSalida= "rgba(255, 0, 0, 145)";
                colorSalidaFin= "rgba(255, 0, 0, 0)";
            }
            else if(stopValue < 0.4 || stopValue > 0.6) {
                colorSalida="rgba(255, 197, 0, 145)";
                colorSalidaFin="rgba(255, 197, 0, 0)";
            }
            else {
                colorSalida="rgba(51, 255, 151, 145)";
                colorSalidaFin="rgba(51, 255, 151, 0)";
            }
            presionSalida = (300 * stopValue).toString() + 'px';

            document.getElementById("presionEntrada").style.height = presionEntrada;
            document.getElementById("presionEntrada").style.width = presionEntrada;
            document.getElementById("presionEntrada").style.borderRadius = presionEntrada;
            document.getElementById("presionEntrada").style.backgroundImage = 'radial-gradient(circle , ' + colorEntrada + ', ' + colorEntradaFin + ')';
            document.getElementById('presionEntrada').style.top = (231 - positionEntrada)+'px';
            //document.getElementById("presionEntrada").style.translate = '0px ' + (231 - positionEntrada)+'px';
            document.getElementById("flujoEntrada").innerHTML = flujoEntrada + ' m/s';

            document.getElementById("presionSalida").style.height = presionSalida;
            document.getElementById("presionSalida").style.width = presionSalida;
            document.getElementById("presionSalida").style.borderRadius = presionSalida;
            document.getElementById("presionSalida").style.backgroundImage = 'radial-gradient(circle , ' + colorSalida + ', ' + colorSalidaFin + ')';
            document.getElementById("flujoSalida").innerHTML = flujoSalida + ' m/s';

        }
        else {
          //document.getElementById("windSpeed").innerHTML = this.status
        }
    };

    // Sending the request to the server
    request.send();
}

function getTime(){
  let request = new XMLHttpRequest();

  // Instantiating the request object
  request.open("GET", "/home?status=timeDate", true);

  // Defining event listener for readystatechange event
  request.onreadystatechange = function() {
      // Check if the request is compete and was successful
      if(this.readyState === 4 && this.status === 200) {
        document.getElementById("currentTime").innerHTML= JSON.parse(this.responseText).time;
        document.getElementById("currentDate").innerHTML= JSON.parse(this.responseText).date;
      }

  };
      // Sending the request to the server
  request.send();
}

//******************************************************************************************************************************************
//rutina
function rutina() {

}

//******************************************************************************************************************************************
//puertaBtn
function controlPuerta() {
  location.href = "./controlPuerta";
}

//******************************************************************************************************************************************
//LED Light button handling
function LED_LightMouseDown() {
  if (LED_pressTimer === null) {
        LED_pressTimer = setTimeout(function() {
            //window.alert("long click");
            //longpress = true;
            LED_pressTimer=null;
            location.href = "./luminariaLED";
        }, 2000);
    }
}

function toggleLED() {
    if (LED_pressTimer !== null) {
        clearTimeout(LED_pressTimer);
        LED_pressTimer = null;
    }
    // Creating the XMLHttpRequest object
    let request = new XMLHttpRequest();

    // Instantiating the request object
    request.open("GET", "/home?status=toggleLED", true);

    // Defining event listener for readystatechange event
    request.onreadystatechange = function() {
        // Check if the request is compete and was successful
        if(this.readyState === 4 && this.status === 200) {
            // Inserting the response from server into an HTML element
            var display = JSON.parse(Text= this.responseText);
            if(display.LED_Light) {
              document.getElementById("LED_LightBtn").innerHTML = '<img id="LightBtn" class="absolute" src="./static/icons/led_on.png" alt="LED_Light">'
            }
            else {
              document.getElementById("LED_LightBtn").innerHTML = '<img id="LightBtn" class="absolute" src="./static/icons/led_off.png" alt="LED_Light">'
            }

            document.getElementById("LightBtn").addEventListener("mousedown",LED_LightMouseDown);
            document.getElementById("LightBtn").addEventListener("click",toggleLED);
        }
    };

    // Sending the request to the server
    request.send();
}

//******************************************************************************************************************************************
function UV_LightMouseDown() {
  if (UV_pressTimer === null) {
        UV_pressTimer = setTimeout(function() {
            //window.alert("UV long click");
            //longpress = true;
            UV_pressTimer=null;
            location.href = "./luminariaUV";
        }, 500);
    }
}

function toggleUV() {

  if (UV_pressTimer !== null) {
      clearTimeout(UV_pressTimer);
      UV_pressTimer = null;
  }

  let request = new XMLHttpRequest();

  // Instantiating the request object
  request.open("GET", "/home?status=toggleUV", true);

  // Defining event listener for readystatechange event
  request.onreadystatechange = function() {
      // Check if the request is compete and was successful
      if(this.readyState === 4 && this.status === 200) {
          // Inserting the response from server into an HTML element
          var display = JSON.parse(Text= this.responseText);
          if(display.UV_Light) {
            document.getElementById("UV_LightBtn").innerHTML = '<img id="uvBtn" class="absolute" src="./static/icons/uv_on.png" alt="UV_Light" onclick="toggleUV()">'
          }
          else {
            document.getElementById("UV_LightBtn").innerHTML = '<img id="uvBtn" class="absolute" src="./static/icons/uv_off.png" alt="UV_Light" onclick="toggleUV()">'
          }

          document.getElementById("uvBtn").addEventListener("mousedown",UV_LightMouseDown);
          document.getElementById("uvBtn").addEventListener("click",toggleUV);
      }
  };

  // Sending the request to the server
  request.send();
}
