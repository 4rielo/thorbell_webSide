window.onload = getStatus;

document.getElementById("goBack").addEventListener("click", goBack);
document.getElementById("upBtn").addEventListener("click", increasePWM);
document.getElementById("downBtn").addEventListener("click", decreasePWM);

function getStatus() {

  let request = new XMLHttpRequest();
  // Instantiating the request object
  request.open("GET", "./luminariaLED?status=refresh", true);
  // Defining event listener for readystatechange event
  request.onreadystatechange = function() {
      // Check if the request is compete and was successful
      if(this.readyState === 4 && this.status === 200) {

        pwm = Number(JSON.parse(this.responseText).LEDPWM);

        show = (1.8 * pwm).toString() + 'px';

        document.getElementById("LED_PWM").style.height = show;
        document.getElementById("LED_PWM").style.width = show;
        document.getElementById("LED_PWM").style.borderRadius = show;
        document.getElementById("LED_PWM").style.backgroundImage = 'radial-gradient(circle , rgba(255,255,255,145),rgba(255,255,255,0))';
        document.getElementById("LED_PWM").style.translate = '0px ' + (240 - pwm*0.75)+'px';

        document.getElementById("LEDPWM").innerHTML = pwm.toString() + '%';
      };
  };
  // Sending the request to the server
  request.send();
}

function goBack() {
  location.href = "./home";
}

function increasePWM() {
  let request = new XMLHttpRequest();
  // Instantiating the request object
  request.open("GET", "./luminariaLED?status=increasePWM", true);
  // Defining event listener for readystatechange event
  request.onreadystatechange = function() {
      // Check if the request is compete and was successful
      if(this.readyState === 4 && this.status === 200) {
        pwm = Number(JSON.parse(this.responseText).LEDPWM);

        show = (1.8 * pwm).toString() + 'px';

        document.getElementById("LED_PWM").style.height = show;
        document.getElementById("LED_PWM").style.width = show;
        document.getElementById("LED_PWM").style.borderRadius = show;
        document.getElementById("LED_PWM").style.backgroundImage = 'radial-gradient(circle , rgba(255,255,255,145),rgba(255,255,255,0))';
        //document.getElementById("LED_PWM").style.translate = '0px ' + (240 - pwm*0.75)+'px';

        document.getElementById("LEDPWM").innerHTML = pwm.toString() + '%';
      };
  };
  // Sending the request to the server
  request.send();
}

function decreasePWM() {
  let request = new XMLHttpRequest();
  // Instantiating the request object
  request.open("GET", "./luminariaLED?status=decreasePWM", true);
  // Defining event listener for readystatechange event
  request.onreadystatechange = function() {
      // Check if the request is compete and was successful
      if(this.readyState === 4 && this.status === 200) {
        pwm = Number(JSON.parse(this.responseText).LEDPWM);

        show = (1.8 * pwm).toString() + 'px';

        document.getElementById("LED_PWM").style.height = show;
        document.getElementById("LED_PWM").style.width = show;
        document.getElementById("LED_PWM").style.borderRadius = show;
        document.getElementById("LED_PWM").style.backgroundImage = 'radial-gradient(circle , rgba(255,255,255,145),rgba(255,255,255,0))';
        //document.getElementById("LED_PWM").style.translate = '0px ' + (240 - pwm*0.75)+'px';

        document.getElementById("LEDPWM").innerHTML = pwm.toString() + '%';
      };
  };
  // Sending the request to the server
  request.send();
}

function toggleLED() {
    // Creating the XMLHttpRequest object
    let request = new XMLHttpRequest();

    // Instantiating the request object
    request.open("GET", "./luminariaLED?status=toggleLED", true);

    // Defining event listener for readystatechange event
    request.onreadystatechange = function() {
        // Check if the request is compete and was successful
        if(this.readyState === 4 && this.status === 200) {
            // Inserting the response from server into an HTML element
            var display = JSON.parse(Text= this.responseText);
            if(display.LED_Light) {
              document.getElementById("LED_LightBtn").innerHTML = '<img id="LightBtn" class="absolute" src="/static/icons/led_on.png" alt="LED_Light">'
            }
            else {
              document.getElementById("LED_LightBtn").innerHTML = '<img id="LightBtn" class="absolute" src="/static/icons/led_off.png" alt="LED_Light">'
            }

            document.getElementById("LightBtn").addEventListener("click",toggleLED);
        }
    };

    // Sending the request to the server
    request.send();
}
