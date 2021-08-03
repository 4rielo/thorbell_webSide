window.onload = getStatus;

document.getElementById("goBack").addEventListener("click", goBack);
document.getElementById("idiomaBtn").addEventListener("click",showHideIdioma);
document.getElementById("languageList").addEventListener("change",changeLanguage);
let x = document.getElementById("language");
x.style.display="none";


function getStatus() {

  let request = new XMLHttpRequest();
  // Instantiating the request object
  request.open("GET", "/config?status=getLanguageList", true);
  // Defining event listener for readystatechange event
  request.onreadystatechange = function() {
      // Check if the request is compete and was successful
      if(this.readyState === 4 && this.status === 200) {
        let list=document.getElementById("languageList");

        let dict = JSON.parse(this.responseText);
        for (item in dict) {
          option = dict[item].replace(".dat", "");
          list.innerHTML+=`<option value="${option}">${option}</option>`;
        }
      };
  };
  request.send();
  // Sending the request to the server
  let request2 = new XMLHttpRequest();
  // Instantiating the request object
  request2.open("GET", "/config?status=status", true);
  // Defining event listener for readystatechange event
  request2.onreadystatechange = function() {
      // Check if the request is compete and was successful
      if(this.readyState === 4 && this.status === 200) {
        let list=document.getElementById("languageList");
        list.value=JSON.parse(this.responseText).Idioma;
      };
  };
  // Sending the request to the server

  request2.send();
}

function goBack() {
  location.href = "./home";
}

function showHideIdioma() {
  //let request = new XMLHttpRequest();
  let x = document.getElementById("language");
  if (x.style.display === "none") {
    x.style.display = "block";
  } else {
    x.style.display = "none";
  }

}

function changeLanguage() {
  let request = new XMLHttpRequest();
  // Instantiating the request object
  let list=document.getElementById("languageList");
  value=list.value;
  request.open("POST", `/config?language=${value}`, true);
  // Defining event listener for readystatechange event
  request.onreadystatechange = function() {
      // Check if the request is compete and was successful
      if(this.readyState === 4 && this.status === 200) {
        let lista=document.getElementById("lista");
        lista=this.responseText;
        updateLanguage();
      };
  };
  // Sending the request to the server
  request.send();
}

function updateLanguage() {
    // Creating the XMLHttpRequest object
    let request = new XMLHttpRequest();

    // Instantiating the request object
    request.open("GET", "/config?status=language", true);

    // Defining event listener for readystatechange event
    request.onreadystatechange = function() {
        // Check if the request is compete and was successful
        if(this.readyState === 4 && this.status === 200) {
            // Inserting the response from server into an HTML element
            let idioma = JSON.parse(Text= this.responseText);
            document.getElementById("configTittle").innerHTML=idioma.configTittle;
        }
    };

    // Sending the request to the server
    request.send();
}
