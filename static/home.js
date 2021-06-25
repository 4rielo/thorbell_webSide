window.onload = setupRefresh;

function setupRefresh() {
    setInterval("getStatus();", 1000);
    setInterval("getAirSpeed();", 1000);
}

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
            document.getElementById("Status").innerHTML = this.responseText;

            var caca = JSON.parse(Text= this.responseText);
            //let caca= {'LED':true};
            //caca.LED=false;
            document.getElementById("LED_Status").innerHTML = caca.LED_Light;

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
            document.getElementById("windSpeed").innerHTML = this.responseText;

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
            }
            else if(stopValue < 0.4 || stopValue > 0.6) {
                colorEntrada="rgba(255,197,0,145)";
            }
            else {
                colorEntrada="rgba(51, 255, 151, 145)";
            }
            presionEntrada = (150 * stopValue).toString() + 'px';

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
            }
            else if(stopValue < 0.4 || stopValue > 0.6) {
                colorSalida="rgba(255,197,0,145)";
            }
            else {
                colorSalida="rgba(51, 255, 151, 145)";
            }
            presionSalida = (150 * stopValue).toString() + 'px';

            document.getElementById("presionEntrada").style.height = presionEntrada;
            document.getElementById("presionEntrada").style.width = presionEntrada;
            document.getElementById("presionEntrada").style.borderRadius = presionEntrada;
            document.getElementById("presionEntrada").style.backgroundImage = 'radial-gradient(circle , ' + colorEntrada + ', rgba(255, 255, 255, 0))';
            document.getElementById("flujoEntrada").innerHTML = flujoEntrada;

            document.getElementById("presionSalida").style.height = presionSalida;
            document.getElementById("presionSalida").style.width = presionSalida;
            document.getElementById("presionSalida").style.borderRadius = presionSalida;
            document.getElementById("presionSalida").style.backgroundImage = 'radial-gradient(circle , ' + colorSalida + ', rgba(255, 255, 255, 0))';
            document.getElementById("flujoSalida").innerHTML = flujoSalida;

        }
        else {
          document.getElementById("windSpeed").innerHTML = this.status
        }
    };

    // Sending the request to the server
    request.send();
}

function toggleLED() {
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
            document.getElementById("LED_Status").innerHTML = display.LED_Light;
            if(display.LED_Light) {
              document.getElementById("LED_LightBtn").innerHTML = '<img src="./static/icons/led_on.png" alt="LED_Light" onclick="toggleLED()">'
            }
            else {
              document.getElementById("LED_LightBtn").innerHTML = '<img src="./static/icons/led_off.png" alt="LED_Light" onclick="toggleLED()">'
            }

            //dogument.getElementById("LED_LightBtn").innerHTML = LED_Btn
        }
    };

    // Sending the request to the server
    request.send();
}
