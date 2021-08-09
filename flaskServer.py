from flask import Flask
from flask import render_template
from flask import request

import subprocess
import requests
import time
import json
import datetime

port = 8085
localhost = f"http://localhost:{port}"


app = Flask(__name__)

@app.route("/home", methods=['GET', 'POST'])
def home():
    if (request.method == "GET"):
        print(request.args.get('status',''))
        demand = request.args.get('status','')
        if(not demand):
            return render_template('hello.html')
        elif(demand == 'refresh'):
            try:
                response = requests.get(f"{localhost}/status").text
                status=json.loads(str(response))
            except:
                status = "Error"

            try:
                response = requests.get(f"{localhost}/adc").text
                adc=json.loads(str(response))
            except:
                #status = "Error"
                adc = {
                        "presionSalida" : "ERROR",
                        "presionEntrada" : "ERROR",
                        "flujoEntrada" : "ERROR" ,
                        "flujoSalida" : "ERROR"
                        }

            try:
                response= requests.get(f"{localhost}/status", params = "time").text
                #Convierte el string con fecha y hora, en OBJETO de datetime
                currentTimeDate=datetime.datetime.fromisoformat(response)
                #Actualiza hora y fecha
                #obtiene la hora en string para mostrar en pantalla
                currentTime=currentTimeDate.strftime("%H:%M:%S")
                today=currentTimeDate.strftime("%d/%m/%Y")
                time = {	"time": currentTime,
                            "date": today
                            }
                #print(f"CurrentTimeDate: {status}")
            except:
                time = {	"time": "ERROR",
                            "date": "ERROR"
                            }
            #print("Some error while getting the time")

            status.update(adc)
            status.update(time)
            return json.dumps(status)
