#! /usr/bin/python3
#

# importing the subprocess module
import cgitb
cgitb.enable()

#import nmclipip3
import web
from web import form
import subprocess
import requests
import time
import json

defaultSSID = "THORBELL"
defaultPASS = "applica07"
homePath = "/home/arielo/MEGAsync/APPLICA/THORBELL/PRODUCTION"
#homePath = "/home/arielo/MEGAsync/APPLICA/THORBELL/PRODUCTION"
#homePath = "/home/applica"
port = 8085
localhost = f"http://localhost:{port}"

urls = ('/','root','/scan','scan','/index','index','/home','home', '/form','form','/connect','connect','/status', 'status')
app = web.application(urls,globals())

class root:
	def __init__(self):
		self.hello="Please go to /scan to search for available networks"

	def GET(self):
		return self.hello

class scan:
	def get_response(self):
		try:
			command="nmcli device"
			response=subprocess.run(command,capture_output=True,text=True,shell=True).stdout
			lines=response.splitlines()
			hotspot=lines[1].split()
			flag_wasHotspot=False
			if(hotspot[3]=="Hotspot"):
				#print("It's a hotspot")
				command="nmcli device disconnect wlan0"
				response=subprocess.run(command,capture_output=True,shell=True)
				flag_wasHotspot=True
				time.sleep(1)

			command="nmcli device wifi list --rescan yes"
			devices = subprocess.run(command,capture_output=True, text=True, shell=True).stdout

			if(flag_wasHotspot):
				command=f"nmcli device wifi hotspot ssid {defaultSSID} password {defaultPASS}"
				response=subprocess.run(command,capture_output=True,shell=True)
		except:
			devices = "Error obtaining WiFi list\n\r"

		return devices

	def GET(self):
		site=self.get_response()
		#print(site)
		return site

class index:

	def __init__(self):
		self.render=web.template.render("templates/")

	def GET(self):
		getInput=scan.get_response(self)
		formated = getInput.splitlines()[0]
		namePosition = formated.find(" SSID") +1
		nameEnd= formated.find("MODE")
		signalStrength= formated.find("SIGNAL")
		signalEnd = formated.find("BARS")
		output=list()
		for line in getInput.splitlines()[1:]:
			output.append((line[0],line[namePosition:nameEnd],line[signalStrength:signalEnd]))
		return self.render.index("Scan List", output)

class home:
	def __init__(self):
		self.render=web.template.render("templates/")
		try:
			status = requests.get(f"{localhost}/status").text
		except:
			status = {'Empty' : True}

	def GET(self):
		input = web.input()
		print(input)
		if(input):
			print("We've got a specific request************************************")
			print(input)
			if(input.status=="refresh"):
				print("need to refresh status only")
				response = requests.get(f"{localhost}/status").text
				status=json.loads(str(response))
				return json.dumps(status)
			elif(input.status=="adc"):
				print("Wants to read ADC Data____________________")
				response = requests.get(f"{localhost}/adc").text
				status=json.loads(str(response))
				return json.dumps(status)
			elif(input.status=="toggleLED"):
				print("Issued an LED toggle")
				response = requests.get(f"{localhost}/status").text
				status=json.loads(str(response))
				status.update({"LED_Light": not status['LED_Light']})
				response = requests.post(f"{localhost}/status",params= {"LED_Light" : status['LED_Light']})
				return json.dumps(status)
		try:
			print("No specific request, load entire page (from templates)")
			"""f= open(f"{homePath}/THORBELL/CSB_MercurioR1/status.dat")
			status = json.load(f)
			f.close()"""
			response = requests.get(f"{localhost}/status").text
			status=json.loads(str(response))
		except:
			status = {"LED": "Oops, something went wrong. No se pudo abrir el archivo."}
		#return status
		return self.render.home(status)

class form:
	def __init__(self):
		self.render=web.template.render("templates/")

	def GET(self):
		getInput=scan.get_response(self)
		formated = getInput.splitlines()[0]
		namePosition = formated.find(" SSID") +1
		nameEnd= formated.find("MODE")
		signalStrength= formated.find("SIGNAL")
		signalEnd = formated.find("BARS")
		output=list()
		for line in getInput.splitlines()[1:]:
			output.append((line[0],str(line[namePosition:nameEnd]).strip(),str(line[signalStrength:signalEnd]).strip()))
		return self.render.form("Scan List", output)

class connect:
	devices="Go to /form to select network"
	def POST(self):
		post = web.input()
		post.red=post.red.replace("¿.","\ ")
		command="nmcli device disconnect wlan0"
		response=subprocess.run(command,capture_output=True,shell=True)
		try:
			#command=['nmcli', 'device', 'wifi', 'connect', str(post>
			command=f"nmcli device wifi connect {post.red} password {post.pwd}"
			stdout= subprocess.run(command, capture_output=True, text=True, shell=True)
			#stdout= os.system(command)
			if(stdout.stdout.find("Device 'wlan0' successfully activated")):
				self.devices= "Conexión exitosa"
			else:
				command=f"nmcli device wifi hotspot ssid {defaultSSID} password {defaultPASS}"
				response=subprocess.run(command,capture_output=True,shell=True)
				self.devices= "Error en la conexión - Restableciendo Hotspot"

			self.devices+= "\n\r"+ str(stdout)
		except subprocess.CalledProcessError as e:
			self.devices =  str(command) + "   ERROR:   " + str(e.stderr)

		#return inputFromForm.red
		return self.devices

	def GET(self):
		return self.devices

class status:
	def __init__(self):
		self.render = web.template.render("templates/")
	def GET(self):
		input = web.input()
		print(input)
		if(input):
			print("We've got a specific request")
			if(input.status=="refresh"):
				response = requests.get(f"{localhost}/status").text
				status=json.loads(str(response))
				return json.dumps(status)
			elif(input.status=="toggleLED"):
				print("Issued an LED toggle")
				response = requests.get(f"{localhost}/status").text
				status=json.loads(str(response))
				status.update({"LED_Light": not status['LED_Light']})
				response = requests.post(f"{localhost}/status",params= {"LED_Light" : status['LED_Light']})
				return json.dumps(status)
		try:
			print("No specific request, load entire page (from templates)")
			"""f= open(f"{homePath}/THORBELL/CSB_MercurioR1/status.dat")
			status = json.load(f)
			f.close()"""
			response = requests.get(f"{localhost}/status").text
			status=json.loads(str(response))
		except:
			status = {"LED": "Oops, something went wrong. No se pudo abrir el archivo."}
		#return status
		return self.render.status(status)

	def POST(self):
		#post = web.input()
		"""with open(f"{homePath}/THORBELL/CSB_MercurioR1/status.dat") as f:
			status=json.load(f)"""

		"""try:
			st = open(f"{homePath}/THORBELL/CSB_MercurioR1/status.dat","w")
			#status = json.load(st)
			#print(file)
			#status = {'LED' : "File oppened"}
			status["LED"] = not status["LED"]
			json.dump(status,st)
			st.close()
		except Exception as e:
			print (e)
			status = {'LED' : "Error abriendo status file"}
			#json.dump(status,st)
			pass"""
		return self.render.status(status)


if __name__ == "__main__":
	app.run()
